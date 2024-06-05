const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: "nodejs-technical-test.cm30rlobuoic.ap-southeast-1.rds.amazonaws.com",
  user: "candidate",
  password: "NoTeDeSt^C10.6?SxwY882}",
  database: "conqtvms_dev",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL is connected");
});

app.get("/api/getVendorUsers", (req, res) => {
  const { prId, custOrId } = req.query;
  console.log(prId,custOrId);
  console.log(req.query);

  if (!prId || !custOrId) {
    return res.status(400).send("prId and custOrId are required");
  }
  const sqlQuery = `SELECT vu.VendorOrganizationId AS supplierId, vu.UserName,
   vu.Name FROM PrLineItems pli JOIN VendorUsers vu ON
    FIND_IN_SET(vu.VendorOrganizationId,pli.suppliers)
     WHERE pli.purchaseRequestId=? AND pli.custOrgId=? AND vu.Role='Admin'
    GROUP BY vu.VendorOrganizationId, vu.UserName, vu.name;`

  db.query(sqlQuery, [prId, custOrId], (err, result) => {
    if (err) {
      return console.log(res.status(500).send(err));
    }
    res.json(result);
    console.log(result);
  });
});
app.listen(port,()=>{
  console.log("port is running in 3000")
})