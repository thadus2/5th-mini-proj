package com.aivle.bookapp.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequestDto {

    private String currentPassword;

    private String name;
    private String nickName;
    private Integer age;
    private String email;
    private String phoneNumber;
    private String address;
    private String userProfileImage;
}