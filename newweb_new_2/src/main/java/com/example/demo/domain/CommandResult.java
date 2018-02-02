package com.example.demo.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2018/1/25.
 */
@Getter
@Setter
@ToString
public class CommandResult implements Serializable {

    private Integer commandId;
    private String result;
}
