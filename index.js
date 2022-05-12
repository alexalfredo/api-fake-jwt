const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const port = 8001;

let totp = require('totp-gen');

/* Generate a secret BASE32 String */
let secretLength = 40;
let secret = totp.generateSecret(secretLength);
 
let time = Date.now();
let periodInSecond = 30;
let lengthOfPin = 6;

/* Generate a TOTP Token using SECRET, time, period and 
   length. 
*/
let totpToken = totp.generateTOTP(secret, time, periodInSecond, lengthOfPin);
 
let company = "MyExampleCompany";
let email = "abc@xyz.com";
 
/* Generate totp URL for authenticator  apps*/
let totpURL = totp.generateURL(company, email, secret, lengthOfPin, periodInSecond);
 
// /* Verify generated token and secret */
if(totp.verifyToken(secret, totpToken, time, periodInSecond, lengthOfPin)){
    console.log(
        {
            secretLength,
            secret, 
            time,
            periodInSecond,
            lengthOfPin,
            totpToken,
            timeLeftForTokenValidity: totp.countdownTimer(periodInSecond),
            totpURL
        }
    )
 }else{
     throw "INVALID_TOKEN_VERIFICATION";
 }

 //////

app.use(bodyParser.json());
app.use(cors());

app.post("/api", (req, res) => {
  const email = "clarobox@nextvision.com.br";
  const password = "123";
  console.log("Email: ", email)
  if (req.body.email === email && req.body.password === password) {
    const data = {
      nome: "Alfredo",
      email,
      role: ["sysAdmin"],
    };
    
    const token = jwt.sign({ data }, "SECRET", {
      expiresIn: 100000,
    });
     
    return res.json({ token: token });
  }

  res.status(500).json({ message: "Usuário ou senha incorreta" });
});

app.listen(port, () => {
  console.log(`Link => http://clarobox.nextvision.com.br:${port}`);
});
