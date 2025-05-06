package com.dentalHCI.dental.service;

public class TransferService {
    public static void createTransfer() {
        final String RED_ON_BLACK = "\u001B[31;40m";
        final String BLUE_ON_BLACK = "\u001B[34;40m";
        final String YELLOW_ON_BLACK = "\u001B[33;40m";
        final String RESET = "\u001B[0m";

        String[] art = {
                "================================================================================",
                "                                                                               ",
                "  ⬜⬜⬜⬜⬜⬜      ⬜⬜⬜⬜⬜⬜        ⬜⬜⬜⬜⬜⬜     ⬜⬜⬜⬜⬜⬜   ",
                "  ⬜⬜⬜⬜⬜⬜⬜    ⬜⬜⬜⬜⬜⬜⬜     ⬜⬜⬜⬜⬜⬜     ⬜⬜⬜⬜⬜⬜    ",
                "  ⬜⬜     ⬜⬜⬜    ⬜⬜       ⬜⬜    ⬜⬜                   ⬜⬜        ",
                "  ⬜⬜       ⬜⬜    ⬜⬜⬜⬜⬜⬜⬜     ⬜⬜⬜⬜⬜⬜         ⬜⬜         ",
                "  ⬜⬜       ⬜⬜    ⬜⬜⬜⬜⬜⬜       ⬜⬜⬜⬜⬜⬜         ⬜⬜         ",
                "  ⬜⬜     ⬜⬜⬜    ⬜⬜     ⬜⬜⬜    ⬜⬜                  ⬜⬜          ",
                "  ⬜⬜⬜⬜⬜⬜⬜    ⬜⬜        ⬜⬜    ⬜⬜⬜⬜⬜⬜    ⬜⬜⬜⬜⬜⬜     ",
                "  ⬜⬜⬜⬜⬜⬜      ⬜⬜        ⬜⬜    ⬜⬜⬜⬜⬜⬜    ⬜⬜⬜⬜⬜⬜      ",
                "                                                                                ",
                "================================================================================",
                "                                                                                ",
                "   |========================================================================|   ",
                "   |                                                                        |   ",
                "   |             WELCOME TO THE 'HCI DENTAL PROJECT DEMO' API               |   ",
                "   |                            DEV, ROBERT BAMBA                           |   ",
                "   |                          https://dreiabmab.com                         |   ",
                "   |                                                                        |   ",
                "   |=============================================++=========================|   ",
                "                                                                                ",
                "================================================================================",
        };


        for (String line : art)  System.out.println(YELLOW_ON_BLACK + line + RESET);
    }
}
