#!/bin/bash

SECRET="@HMAC"
CLODINITPAYLOAD="/etc/scape_cloud_init.payload"
INSCT="/var/tmp/sct_in_content.raw"
INSCTPAYLOAD="/var/tmp/sct_in_content.payload"
SCTLOG="/var/log/sct_stage1.log"
while [ ! -e  "${CLODINITPAYLOAD}" ]; do
    nc -l 8080  >${INSCT}

    cat ${INSCT} | (
        read PROVIDED_HMAC
        cat > ${INSCTPAYLOAD}
        COMPUTED_HMAC=$(cat ${INSCTPAYLOAD} | openssl sha1 -hmac "${SECRET}" | cut -d "=" -f 2 | tr -d " ")
        echo "Provided HMAC: " "${PROVIDED_HMAC}" >>${SCTLOG}
        echo "Computed HMAC: " "${COMPUTED_HMAC}" >>${SCTLOG}

        if [ "${PROVIDED_HMAC}" == "${COMPUTED_HMAC}" ]; then
            echo "HMAC matched" >>${SCTLOG}
            cp ${INSCTPAYLOAD} ${CLODINITPAYLOAD}
        else
            echo "HMAC does not match" >>${SCTLOG}
        fi
    )

done
