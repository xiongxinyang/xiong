package com.example.demo.common;

/**
 * Created by xiong on 2017/12/28.
 */
public final class RefObject<T> {
    public T argvalue;

    public RefObject(T refarg) {
        this.argvalue = refarg;
    }
}