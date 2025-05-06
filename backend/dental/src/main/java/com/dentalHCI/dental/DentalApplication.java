package com.dentalHCI.dental;

import com.dentalHCI.dental.service.TransferService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DentalApplication {

	public static void main(String[] args) {
		TransferService.createTransfer();
		SpringApplication.run(DentalApplication.class, args);
	}

}
