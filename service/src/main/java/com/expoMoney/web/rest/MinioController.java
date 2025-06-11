package com.expoMoney.web.rest;

import com.expoMoney.service.MinioService;
import com.expoMoney.service.dto.ArrayMinioFileDTO;
import io.minio.errors.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/minio")
public class MinioController {

    private final MinioService service;

    @GetMapping("/download/{bucket}/{arquivo}")
    @Operation(tags = {"MINIO"}, summary = "Download arquivo",
            description = "Requisicao GET para Recuperar arquivo Minio", security = {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<InputStreamResource> findBanner( @PathVariable("bucket") String bucket, @PathVariable("arquivo")String arquivo, HttpServletRequest request) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        log.info("REQUISICAO GET PARA OBTER ARRAY DE BYTE DE ARQUIVO");

        bucket = bucket.replaceAll("_","-").toLowerCase();

        ArrayMinioFileDTO dto = service.dowload(arquivo, bucket);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(dto.getOutputStream().toByteArray());
        HttpHeaders headers = new HttpHeaders();

        MediaType mediaType = null;

        switch (dto.getExtensao()){
            case ".jpeg", ".jpg":
                mediaType = MediaType.IMAGE_JPEG;
                break;
            case ".png":
                mediaType = MediaType.IMAGE_PNG;
                break;
            case ".mp4":
                mediaType = MediaType.valueOf("video/mp4");
                break;
        }

        headers.setContentType(mediaType);
        InputStreamResource resource = new InputStreamResource(inputStream);
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(dto.getOutputStream().size())
                .body(resource);
    }

    @DeleteMapping("/remove/{file}")
    @Operation(tags = {"MINIO"}, summary = "Remover de arquivo",
            description = "Requisicao DELETE para remocao de arquivo", security =  {@SecurityRequirement(name = "BearerJWT")}
    )
    public ResponseEntity<Void> remove(@PathVariable("file") String file, HttpServletRequest request) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {
        log.info("REQUISICAO DELETE PARA REMOVER ARQUIVO");

        String bucket = request.getHeader("X-Tenant-ID").replaceAll("_", "-").toLowerCase();

        service.removeFile(bucket, file);
        return ResponseEntity.noContent().build();
    }
}
