<?php
if(isset($_POST['email']) && !empty($_POST['email'])){

		$name = $_POST["name"];
		$email = $_POST["email"];
		$message = $_POST["message"];


		$timestamp_capture = time();


		if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on'){
	    	$siteurl = "https://".$_SERVER['SERVER_NAME'];
	   }else{
	    	$siteurl = "http://".$_SERVER['SERVER_NAME'];
	   }

	
		$to = "test@websitetemplates.site";
		$mail_subject = "Site Query From $name | Message ID ".$timestamp_capture;
		$mail_message = "
		<br>
		<p>You received a contact query from your website. Details are as below:</p>
		<br>
		<p><strong>Name:</strong> $name</p> 
		<p><strong>Email:</strong> $email</p> 
		<br>
		<p>Message:</p>
		$message
		<br><br>...<br>
		This message is sent from $siteurl using a contact form.
		";
		$headers = "MIME-Version: 1.0" . "\r\n";
		$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
		// More headers
		$headers .= 'From: '.$name.' <noreply@'.$_SERVER['SERVER_NAME'].'>' . "\r\n" . 'Reply-To: '.$email."\r\n";
		$sendmail = mail($to,$mail_subject,$mail_message,$headers);
		//$sendmail = 'ok';
		if($sendmail){
			$response['status'] = 'Ok';
			//$response['msg'] = 'Request Submitted Successfully. &nbsp; <span class="fa-solid fa-check"></span>';
			echo json_encode($response);
		}else{
			$response['status'] = 'Error';
			//$response['msg'] = 'Something Went Wrong. Send Us an Email Directly.';
			echo json_encode($response);
		}
}else{
	$response['status'] = 'Error';
	//$response['msg'] = 'Something Went Wrong. Send Us an Email Directly.';
	echo json_encode($response);
}
?>