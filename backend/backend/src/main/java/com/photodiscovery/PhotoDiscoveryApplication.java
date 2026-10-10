package com.photodiscovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class PhotoDiscoveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(PhotoDiscoveryApplication.class, args);
	}

}
