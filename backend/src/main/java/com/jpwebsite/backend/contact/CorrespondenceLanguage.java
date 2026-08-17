package com.jpwebsite.backend.contact;

public enum CorrespondenceLanguage {
    FR("Français"),
    EN("Anglais");

    private final String frenchLabel;

    CorrespondenceLanguage(String frenchLabel) {
        this.frenchLabel = frenchLabel;
    }

    public String frenchLabel() {
        return frenchLabel;
    }
}
