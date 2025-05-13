package com.expoMoney.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.NotAuthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Objects;

@ControllerAdvice
public class ResourcesExceptionsHandler {


    @ExceptionHandler(NotAuthorizedException.class)
    public ResponseEntity<MensagemPadrao> notAuthorizedException(NotAuthorizedException e, HttpServletRequest request){

        MensagemPadrao obj = new MensagemPadrao();

        HttpStatus httpStatus = HttpStatus.UNAUTHORIZED;

        String message;

        if(Objects.equals(e.getMessage(), "HTTP 401 Unauthorized")){
            message = "Username or Password is wrong";
        }else{
            message = e.getMessage();
        }

        obj.setIdStatus(httpStatus.value());
        obj.setCausa(httpStatus.toString());
        obj.setMensagem(message);
        obj.setPath(request.getContextPath() + request.getServletPath());
        obj.setData(LocalDateTime.now());

        e.printStackTrace();

        return  ResponseEntity.status(httpStatus).body(obj);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<MensagemPadrao> noSuchElementException(NoSuchElementException e, HttpServletRequest request){

        MensagemPadrao obj = new MensagemPadrao();

        HttpStatus httpStatus = HttpStatus.NOT_FOUND;

        obj.setIdStatus(httpStatus.value());
        obj.setCausa(httpStatus.toString());
        obj.setMensagem(e.getMessage());
        obj.setPath(request.getContextPath() + request.getServletPath());
        obj.setData(LocalDateTime.now());

        e.printStackTrace();

        return  ResponseEntity.status(httpStatus).body(obj);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MensagemPadrao> illegalArgumentException(IllegalArgumentException e, HttpServletRequest request){

        MensagemPadrao obj = new MensagemPadrao();

        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

        obj.setIdStatus(httpStatus.value());
        obj.setCausa(httpStatus.toString());
        obj.setMensagem(e.getMessage());
        obj.setPath(request.getContextPath() + request.getServletPath());
        obj.setData(LocalDateTime.now());

        e.printStackTrace();

        return  ResponseEntity.status(httpStatus).body(obj);
    }

}
