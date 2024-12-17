package dev.amitwani.githubwrapped.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllUserDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private String username;
}
