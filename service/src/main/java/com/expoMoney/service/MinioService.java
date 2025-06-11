package com.expoMoney.service;

import com.expoMoney.security.SecurityConfig;
import com.expoMoney.service.dto.ArrayMinioFileDTO;
import io.minio.*;
import io.minio.errors.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    @Value("${minio.usuario}")
    private String usuario;
    @Value("${minio.senha}")
    private String senha;
    @Value("${minio.url}")
    private String url;

    private final SecurityConfig securityConfig;

    private MinioClient minio() {
        return MinioClient.builder()
                .endpoint(url)
                .credentials(usuario, senha)
                .build();
    }

    public void createBucket() throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        String bucketName = securityConfig.extractTenantFromRequest().replaceAll("_","-").toLowerCase();

        if(!minio().bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())){
            minio().makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    public String uploadArquivo(MultipartFile file, String bucket) throws IOException, ServerException, InsufficientDataException, ErrorResponseException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        if(file.getSize() == 0){
            throw new IllegalArgumentException("Arquivo ausente");
        }

        String uuid = UUID.randomUUID().toString() + Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));

        var putObjectArgs = PutObjectArgs.builder()
                .bucket(bucket)
                .object(uuid)
                .contentType(file.getContentType())
                .stream(file.getInputStream(), file.getSize(), -1)
                .build();

        minio().putObject(putObjectArgs);

        return uuid;
    }

    public ArrayMinioFileDTO dowload(String arquivo, String bucket) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        var getobject = GetObjectArgs.builder()
                .bucket(bucket)
                .object(arquivo)
                .build();

        byte[] array = minio().getObject(getobject).readAllBytes();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(array.length);
        byteArrayOutputStream.write(array);

        ArrayMinioFileDTO minioFileDTO = new ArrayMinioFileDTO();
        minioFileDTO.setOutputStream(byteArrayOutputStream);
        minioFileDTO.setExtensao(arquivo.substring(arquivo.lastIndexOf(".")));

        return minioFileDTO;
    }

    public void removeFile(String bucket, String arquivo) throws ServerException, InsufficientDataException, ErrorResponseException, IOException, NoSuchAlgorithmException, InvalidKeyException, InvalidResponseException, XmlParserException, InternalException {

        var getobject = RemoveObjectArgs.builder()
                .bucket(bucket)
                .object(arquivo)
                .build();

        minio().removeObject(getobject);
    }
}