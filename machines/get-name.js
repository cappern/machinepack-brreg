module.exports = {


    friendlyName: 'Get Name',


    description: 'Get company by name',


    extendedDescription: '',


    inputs: {
        name: {
            example: 'Applestore',
            description: 'The company name.',
            required: true
        },


    },


    defaultExit: 'success',
    exits: {
        error: {
            description: 'Unexpected error occurred.'
        },
        unknownOrInvalidCompany: {
            description: 'Invalid or unknown company.'
        },
        success: {
            description: 'Returns all company info.',
            example: [{
                organisasjonsnummer: 981362772,
                navn: 'APPLESTORE DYBING',
                registreringsdatoEnhetsregisteret: '1999-12-17',
                organisasjonsform: 'ENK',
                registrertIFrivillighetsregisteret: 'N',
                registrertIMvaregisteret: 'N',
                registrertIForetaksregisteret: 'N',
                registrertIStiftelsesregisteret: 'N',
                institusjonellSektorkode: {
                    kode: '8200',
                    beskrivelse: 'Personlig næringsdrivende'
                },
                naeringskode1: {
                    kode: '62.010',
                    beskrivelse: 'Programmeringstjenester'
                },
                forretningsadresse: {
                    adresse: 'Christies gate 34C',
                    postnummer: '0557',
                    poststed: 'OSLO',
                    kommunenummer: '0301',
                    kommune: 'OSLO',
                    landkode: 'NO',
                    land: 'Norge'
                },
                konkurs: 'N',
                underAvvikling: 'N',
                underTvangsavviklingEllerTvangsopplosning: 'N',
                links: [{
                    rel: 'self',
                    href: 'http://data.brreg.no/enhetsregisteret/enhet/981362772'
                }]
            }]
        }
    },
    fn: function(inputs, exits) {

        var URL = require('url');
        var Http = require('machinepack-http');

        Http.sendHttpRequest({
            baseUrl: 'http://data.brreg.no/enhetsregisteret/enhet.json?page=0&size=30&$filter=startswith(navn,' + "'" + inputs.name + "'" + ')',
            url: '',
            method: 'get',
        }).exec({
            // OK.
            success: function(result) {
                //console.log(result);

                try {
                    var responseBody = JSON.parse(result.body);
                    var resultParsed = responseBody.data;
                    //console.log(responseBody.data);
                } catch (e) {
                    return exits.error('An error occurred while parsing the body.');
                }
                console.log(resultParsed);
                return exits.success(resultParsed);

            },
            // Non-2xx status code returned from server
            notOk: function(result) {

                try {
                    if (result.status === 400) {
                        return exits.unknownOrInvalidCompany("Invalid or unknown company.");
                    }
                } catch (e) {
                    return exits.error(e);
                }

            },
            // An unexpected error occurred.
            error: function(err) {

                exits.error(err);
            },
        });
    },
};