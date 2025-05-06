package com.dentalHCI.dental.dto;

import com.dentalHCI.dental.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String name;
    private String role;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return new UserDto(user.getId(), user.getUsername(), user.getName(), user.getRole().name());
    }
}