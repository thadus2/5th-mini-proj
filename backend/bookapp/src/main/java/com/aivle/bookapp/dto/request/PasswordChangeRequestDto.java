package com.aivle.bookapp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordChangeRequestDto {

    private String currentPassword;
    private String newPassword;
}
