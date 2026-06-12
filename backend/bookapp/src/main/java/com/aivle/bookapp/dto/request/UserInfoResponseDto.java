package com.aivle.bookapp.dto.request;

import com.aivle.bookapp.domain.User;
import lombok.Getter;


@Getter
public class UserInfoResponseDto {

    private final Long userId;
    private final String loginId;
    private final String name;
    private final String nickName;
    private final Integer age;
    private final String email;
    private final String phoneNumber;
    private final String address;

    public UserInfoResponseDto(User user) {
        this.userId = user.getUserId();
        this.loginId = user.getLoginId();
        this.name = user.getName();
        this.nickName = user.getNickName();
        this.age = user.getAge();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
    }
}
