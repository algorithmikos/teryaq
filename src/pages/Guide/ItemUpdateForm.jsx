import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";

const ItemUpdateForm = ({ formData, setFormData }) => {
  const { item, qty, carb, type, tags } = formData;

  const handleTagsChange = (event) => {
    const {
      target: { value },
    } = event;

    setFormData({
      ...formData,
      tags: typeof value === "string" ? value.split(",") : value,
    });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    "خضر",
    "فواكه",
    "لحوم",
    "أسماك",
    "بيض",
    "منتجات الألبان",
    "منتجات الحبوب والنشويات",
    "مأكولات بحرية",
    "مشتقات السكر",
    "مأكولات عالمية",
    "مشروبات",
    "مأكولات نباتية",
    "حساء وشوربة",
    "مكملات غذائية",
  ];

  const capitalise = (inputString) => {
    let words = inputString.split(" ");
    let capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    let resultString = capitalizedWords.join(" ");
    return resultString;
  };

  const capitaliseFirst = (word) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  return (
    <>
      {/* Form Section */}
      <Grid container spacing={2} alignItems="center" maxWidth={500} mt={1}>
        {/* Item Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <TextField
            label="اسم الصنف"
            variant="outlined"
            fullWidth
            value={item}
            onChange={(e) =>
              setFormData({
                ...formData,
                item: capitalise(e.target.value),
              })
            }
            type="text"
          />
        </Grid>
        {/* End of Item Field */}

        {/* Qty Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <TextField
            label="الكمية"
            variant="outlined"
            fullWidth
            type="text"
            value={qty}
            onChange={(e) =>
              setFormData({
                ...formData,
                qty: capitaliseFirst(e.target.value),
              })
            }
          />
        </Grid>
        {/* End of Qty Field */}

        {/* Carb Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <TextField
            label="غرامات الكارب"
            variant="outlined"
            fullWidth
            type="number"
            value={carb}
            onChange={(e) =>
              setFormData({
                ...formData,
                carb: Number(e.target.value),
              })
            }
          />
        </Grid>
        {/* End of Carb Field */}

        {/* Type Field */}
        <Grid item xl={12} lg={12} xs={12}>
          <FormControl fullWidth>
            <InputLabel>النوع</InputLabel>
            <Select
              label="النوع"
              value={type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value,
                })
              }
            >
              <MenuItem value="اختر" selected disabled>
                اختر النوع
              </MenuItem>
              <MenuItem value="edible">طعام</MenuItem>
              <MenuItem value="drinkable">شراب</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* End of Type Field */}

        {/* Tags Field */}
        <Grid item xl={12} lg={12} xs={12} container direction="column" gap={1}>
          <FormControl fullWidth>
            <InputLabel>الوسوم</InputLabel>
            <Select
              label="الوسوم"
              multiple
              value={tags}
              onChange={handleTagsChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(" و")}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={tags.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              setFormData({
                ...formData,
                tags: [],
              });
            }}
          >
            إزالة كل الوسوم
          </Button>
        </Grid>
        {/* End of Tags Field */}
      </Grid>
      {/* End of Form Section */}
    </>
  );
};

export default ItemUpdateForm;
