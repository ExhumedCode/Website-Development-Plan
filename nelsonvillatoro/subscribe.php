<?php
header('Content-Type: application/json');
session_start();

// Generate CSRF token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Set your personal email address here
$recipient = "villatoro.g.nelson@gmail.com";

// Only process POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the POST data from the request body for Vue.js ajax requests
    $postData = $_POST;
    
    // If no POST data is found, check for JSON input
    if (empty($postData)) {
        $inputJSON = file_get_contents('php://input');
        $postData = json_decode($inputJSON, true);
    }
    
    // Validate CSRF token - comment this out during testing if needed
    // if (!isset($postData['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $postData['csrf_token'])) {
    //     echo json_encode(["status" => "error", "message" => "Invalid CSRF token."]);
    //     exit;
    // }

    // Retrieve and sanitize form inputs
    $name = isset($postData["name"]) ? strip_tags(trim($postData["name"])) : '';
    $email = isset($postData["email"]) ? filter_var(trim($postData["email"]), FILTER_SANITIZE_EMAIL) : '';

    // Validate form inputs
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Please provide a valid name and email address."]);
        exit;
    }

    // For testing purposes (comment out in production)
    // Simulate successful subscription without actually sending email
    echo json_encode(["status" => "success", "message" => "Thank you for subscribing, $name! We've sent a confirmation to $email."]);
    exit;

    // Uncomment the following code to enable actual email sending when ready
    /*
    // Prepare email content
    $subject = "New Subscription from Website";
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";

    // Email headers
    $headers = "From: $name <$email>";

    // Send email
    if (mail($recipient, $subject, $email_content, $headers)) {
        echo json_encode(["status" => "success", "message" => "Thank you for subscribing, $name! We've sent a confirmation to $email."]);
    } else {
        echo json_encode(["status" => "error", "message" => "There was a problem with your subscription. Please try again."]);
    }
    */
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request. Please use the form to subscribe."]);
}
?>