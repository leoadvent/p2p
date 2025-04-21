package com.expoMoney;

import com.expoMoney.tenancy.SchemaCreator;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class ExpoMoneyApplication implements InitializingBean {

	private final SchemaCreator schemaCreator;

    public ExpoMoneyApplication(SchemaCreator schemaCreato) {
        this.schemaCreator = schemaCreato;
    }

    public static void main(String[] args) {
		SpringApplication.run(ExpoMoneyApplication.class, args);
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		schemaCreator.createSchema("public");
	}
}
