// Gõ lệnh 'ng s' để chạy môi trường BE mặc định --> http://45.122.253.178:8989/
// Gõ lệnh 'ng s -c localhost' để chạy môi trường BE --> http://localhost:8989/
// Gõ lệnh 'ng s -c dev' để chạy môi trường BE --> http://45.122.253.178:8989/
// Gõ lệnh 'ng s -c uat' để chạy môi trường BE --> https://gateway.vksndtc.gov.vn/
// Gõ lệnh 'ng s -c live' để chạy môi trường BE --> https://gateway.vksndtc.gov.vn/

// GATEWAY_URI: 'http://192.168.18.82:6007'
// GATEWAY_URI: 'http://192.168.18.82:8989'
// GATEWAY_URI: 'http://192.168.18.82:8989'
// http://45.122.253.178:8989
export const environment = {
  production: false,
  runSSO: true,
  GATEWAY_URI: 'http://45.122.253.178:8989',
  SOTHULY_URI: 'http://baocao.vksndtc.gov.vn:4200',
  DOMAIN: '.vksndtc.gov.vn'
};
