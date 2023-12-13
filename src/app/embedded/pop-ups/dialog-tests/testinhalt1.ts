
export interface Data {
  id: number;
  inhalt: string;
}
export const data: Data[]= [
  {
    id:0,
    inhalt:'GET https://centralsearch-test.ccpit.dktk.dkfz.de:443/dktk/sites/teststandort/teiler/ttlrhd3/uploadStats HTTP/1.1 \n HTTP/1.1 200 ',

  },
  {
    id:1,
    inhalt:'Created Dummy Patient: <ns13:Patient id="DUMMY_UPLOAD_PATIENT" xsi:schemaLocation="http://schema.samply.de/ccp/Patient,https://schema.samply.de/ccp/Patient.xsd" xmlns:ns2="http://schema.samply.de/ccp/Value" xmlns:ns4="http://schema.samply.de/ccp/Query" xmlns:ns3="http://schema.samply.de/ccp/Attribute" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:ns6="http://schema.samply.de/ccp/MdrKey" xmlns:ns5="http://schema.samply.de/ccp/Container" xmlns:ns8="http://schema.samply.de/ccp/Sample" xmlns:ns7="http://schema.samply.de/ccp/Case" xmlns:ns13="http://schema.samply.de/ccp/Patient" xmlns:ns9="http://schema.samply.de/ccp/Inquiry" xmlns:ns12="http://schema.samply.de/ccp/RangeAttribute" xmlns:ns11="http://schema.samply.de/ccp/MultivalueAttribute" xmlns:ns10="http://schema.samply.de/ccp/Error" xmlns:ns15="http://schema.samply.de/ccp/Entity" xmlns:ns14="http://schema.samply.de/ccp/QueryResult"><ns7:Case id="case1"><ns3:Attribute><ns6:MdrKey>urn:dktk:dataelement:1:3</ns6:MdrKey><ns2:Value>M</ns2:Value></ns3:Attribute></ns7:Case><ns8:Sample id="sample1"><ns3:Attribute><ns6:MdrKey>urn:dktk:dataelement:97:1</ns6:MdrKey><ns2:Value>DNA</ns2:Value></ns3:Attribute></ns8:Sample></ns13:Patient> ' +
      'Generated export id: '+
      'Zo8A0xXsyO2TqHiTSCFCkH0L0nNAV0HrughVQndVt7Rf8rdlXYsmjm0q51rXSQmFP0Ys6H67NRNifOELrcyd7gOJjc5BZhbUzbFSk0ByxuWmFL975bexcfCKyYx_KOVt0abwLDjyupe7xOBJTWC7onoYL7NhcRNZ-sHg2qJCBzkeklvZjmblvcX-ZFoAea0VR4gpgz60f8mlkrjenjfXgerNTlzg53BJdGJmoG7pRC-eCbdSub9BMIwMuagokTMbDHckltxYdvwgxlMtxhQUH-wNGgEFGEB0DVTSda9q2GBsI2-uvHmb55h9Dg6hRUViMmvcsvDP6qrLPEmekp7B4A== '+
      'Upload ok, got status code 200 '+
      'Delete Patients with prefix "Teststandort_UPLOADTEST_" returned status code 400 '
  },
  {
    id:3,
    inhalt: 'GET http://dktk-bridge-dev:8180/ID-Manager/ HTTP/1.1 '+
      'HTTP/1.1 200 '
  },
  {
    id:4,
    inhalt:''

  },
  {
    id:5,
    inhalt:'GET http://dktk-bridge-dev:8080/centraxx/rest/info/ HTTP/1.1 '+
      'HTTP/1.1 200 OK'
  },
  {
    id:6,
    inhalt:'GET / HTTP/1.1 '+
      'HTTP/1.1 200 OK ',
  },
  {
    id:7,
    inhalt:'GET /rest/test/inquiries/1 HTTP/1.1 '+
      'Authorization Samply 6MG1WidQO226Hpwtjr3XTuLYmYMyrSZrRMSuUTNfPa6J3R0Deh5Do3eRyoHvbiD3 '+
      'HTTP/1.1 200 OK '+
      'Successfully unmarshalled inquiry '+
      '<ns10:Inquiry id="0" revision="1" xmlns:ns6="http://schema.samply.de/common/RangeAttribute" xmlns:ns5="http://schema.samply.de/common/MultivalueAttribute" xmlns:ns8="http://schema.samply.de/common/QueryResultStatistic" xmlns:ns7="http://schema.samply.de/common/MdrKey" xmlns:ns9="http://schema.samply.de/common/Error" xmlns:ns11="http://schema.samply.de/cql/CqlQueryList" xmlns:ns10="http://schema.samply.de/common/Inquiry" xmlns:ns2="http://schema.samply.de/common/Query" xmlns:ns4="http://schema.samply.de/common/Attribute" xmlns:ns3="http://schema.samply.de/common/Value"><ns2:Query><ns2:Where><ns2:And><ns2:Eq><ns4:Attribute><ns7:MdrKey>urn:dktk:dataelement:1:*</ns7:MdrKey><ns3:Value>M</ns3:Value></ns4:Attribute></ns2:Eq></ns2:And></ns2:Where></ns2:Query><ns10:ExposeURL>https://decentralsearch-test.ccp-it.dktk.dkfz.de/rest/test/exposes/0</ns10:ExposeURL><ns10:Author><ns10:title>-</ns10:title><ns10:firstname>n/a</ns10:firstname><ns10:lastname>n/a</ns10:lastname><ns10:phone>-</ns10:phone><ns10:email>no-reply@ccp-it.dktk.dkfz.de</ns10:email><ns10:organization>DKTK CCP-IT</ns10:organization></ns10:Author><ns10:Label>Testquery</ns10:Label><ns10:Description>This is just a testquery.</ns10:Description><ns10:SearchFor>patienten</ns10:SearchFor></ns10:Inquiry> ',
  },
  {
    id:8,
    inhalt:'GET /rest/test/inquiries/1 HTTP/1.1 '+
      'Authorization Samply 6MG1WidQO226Hpwtjr3XTuLYmYMyrSZrRMSuUTNfPa6J3R0Deh5Do3eRyoHvbiD3 '+
      'HTTP/1.1 200 OK '+
      'Successfully unmarshalled inquiry '+
      '<ns10:Inquiry id="0" revision="1" xmlns:ns6="http://schema.samply.de/common/RangeAttribute" xmlns:ns5="http://schema.samply.de/common/MultivalueAttribute" xmlns:ns8="http://schema.samply.de/common/QueryResultStatistic" xmlns:ns7="http://schema.samply.de/common/MdrKey" xmlns:ns9="http://schema.samply.de/common/Error" xmlns:ns11="http://schema.samply.de/cql/CqlQueryList" xmlns:ns10="http://schema.samply.de/common/Inquiry" xmlns:ns2="http://schema.samply.de/common/Query" xmlns:ns4="http://schema.samply.de/common/Attribute" xmlns:ns3="http://schema.samply.de/common/Value"><ns2:Query><ns2:Where><ns2:And><ns2:Eq><ns4:Attribute><ns7:MdrKey>urn:dktk:dataelement:1:*</ns7:MdrKey><ns3:Value>M</ns3:Value></ns4:Attribute></ns2:Eq></ns2:And></ns2:Where></ns2:Query><ns10:ExposeURL>https://decentralsearch-test.ccp-it.dktk.dkfz.de/rest/test/exposes/0</ns10:ExposeURL><ns10:Author><ns10:title>-</ns10:title><ns10:firstname>n/a</ns10:firstname><ns10:lastname>n/a</ns10:lastname><ns10:phone>-</ns10:phone><ns10:email>no-reply@ccp-it.dktk.dkfz.de</ns10:email><ns10:organization>DKTK CCP-IT</ns10:organization></ns10:Author><ns10:Label>Testquery</ns10:Label><ns10:Description>This is just a testquery.</ns10:Description><ns10:SearchFor>patienten</ns10:SearchFor></ns10:Inquiry> ',
  },
]
