package com.jpwebsite.backend.contact;

public class ContactEmailDeliveryException extends RuntimeException {
    public ContactEmailDeliveryException(String message) {
        super(message);
    }

    public ContactEmailDeliveryException(String message, Throwable cause) {
        super(message, cause);
    }
}
