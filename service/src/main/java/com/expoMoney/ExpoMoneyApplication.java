package com.expoMoney;

import com.expoMoney.tenancy.SchemaCreator;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
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
