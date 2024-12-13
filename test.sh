#!/bin/bash
#---------------------------------------------------------------------
# Es wird regelmäßig ein http-request ausgeführt.
# Dabei kommt ein String zurück oder nicht.
#
# Je nach String wird dann ein entsprechendes Telegramm versendet
#---------------------------------------------------------------------

while true; do

   # http-request
    request=$(curl  -m 2 -s https://lichtskulpturenpfad.thedannicraft.de/api/getAction)
     
   # Leerzeichen wegmachen und alles uppercase
   para=$(echo $request | tr -d " " | tr '[:lower:]' '[:upper:]')

   # werte den Parameter aus
   case "$para" in
      "ENGEL")   echo "Engel"
      ./sendTelegram.sh 1
      ;;
      "KRIPPE")   echo "Krippe"
      ./sendTelegram.sh 2
      ;;
      "STERN")   echo "Stern"
      ./sendTelegram.sh 5
      ;;
      "HERZ")   echo "Herz"
      ./sendTelegram.sh 3
      ;;
      "SCHAF")   echo "Schaf"
      ./sendTelegram.sh 4
      ;;
      "AUS")   echo "Aus"
      ./sendTelegram.sh A
      ;;
      "EIN")   echo "Ein"
      ./sendTelegram.sh E
      ;;
   esac

   sleep 1

done