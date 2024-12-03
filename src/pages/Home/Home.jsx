import React from "react";
import "./Home.css";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";

import { Link } from "react-router-dom";
import { userData } from "../../utils/userData";

const Home = () => {
  const dosesData = [
    {
      text: "حساب جرعة الطعام",
      link: "/eating-dose",
      img: "https://i.imgur.com/h19sX47.jpg",
    },
    {
      text: "جرعة التصحيح",
      link: "/correction-dose",
      img: "https://i.imgur.com/XQR70Bx.jpg",
    },
    {
      text: "جرعة النسيان",
      link: "/base-dose",
      img: "https://i.imgur.com/5C9vdWs.jpg",
    },
  ];

  return (
    <Grid
      container
      direction="column"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <Typography gutterBottom variant="h4" component="div">
          كيف يمكنني مساعدتك اليوم يا {userData.firstname}؟
        </Typography>
      </Grid>

      <Grid item>
        <Grid container gap={2}>
          {dosesData.map((item, index) => (
            <Link to={item.link} className="list-item-link" key={index}>
              <Card sx={{ width: 250 }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.img}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.text}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
