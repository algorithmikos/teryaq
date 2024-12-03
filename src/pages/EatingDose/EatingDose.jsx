import React, { useEffect, useState } from "react";
import "./EatingDose.css";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  FormControl,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  AlertTitle,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import ScaleIcon from "@mui/icons-material/Scale";
import RedoIcon from "@mui/icons-material/Redo";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import { unitGrammar } from "../../components/grammar";
import { fetchGuide, setGuide } from "../../rtk/slices/guide-slice";
import { toast } from "react-toastify";
import { randomDoseImg } from "./doseImg";

const EatingDose = () => {
  const dispatch = useDispatch();
  const guide = useSelector((state) => state.guide.carbGuide);
  const weightGuide = useSelector((state) => state.weightGuide);

  useEffect(() => {
    dispatch(setGuide());
  }, []);

  const patient = useSelector((state) => state.patient);
  const carbAndWeightGuide = [...guide, ...weightGuide];

  const options = carbAndWeightGuide?.map((item) => ({
    label: !item.calc
      ? `${item.item} - ${item.carb}ك`
      : `${item.item} - حسب الوزن`,
    value: item.id,
  }));

  const doses =
    Number(patient.breakfastDose) +
    Number(patient.lunchDose) +
    Number(patient.dinnerDose) +
    Number(patient.organizerDose);

  const carpCoefficient = patient.carpCoefficient || (500 / doses).toFixed(2);

  const [selected, setSelected] = useState([]);
  const [insulinDose, setInsulinDose] = useState(0);
  const [title, setTitle] = useState("أطعمة");

  const [guideSelected, setGuideSelected] = useState([]);

  // Function to calculate total carb
  const calculateTotalCarb = () => {
    if (guideSelected.some((item) => item.calc && !item.carb)) {
      toast.warning("لم تحدد وزنا لأحد الأصناف غير محددة الكارب");
      return;
    }

    if (guideSelected.some((item) => !item.calc && !item.carb)) {
      toast.warning("لم تحدد كمية صحيحة لأحد الأصناف محددة الكارب");
      return;
    }

    const guideSelectedCarbs = guideSelected.map((item) => item.carb);

    // Multiply all carb amounts and divide by carpCoefficient
    const calculatedTotalCarb =
      guideSelectedCarbs.reduce((acc, carb) => acc + carb, 1) / carpCoefficient;

    // Update the state with the calculated total carb
    setInsulinDose(calculatedTotalCarb);

    showMealDose(true);
    showMealItems(false);
  };

  useEffect(() => {
    if (
      guideSelected.some((item) => item.type === "edible") &&
      guideSelected.some((item) => item.type === "drinkable")
    ) {
      setTitle("راجع الأطعمة والمشروبات");
    } else if (guideSelected.some((item) => item.type === "drinkable")) {
      setTitle("راجع المشروبات");
    } else if (guideSelected && !guideSelected.length > 0) {
      setTitle("راجع الأطعمة");
    }
  }, [guideSelected]);

  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "ليس هناك أصناف محددة";
  };

  const [openItemMod, setOpenItemMod] = useState(false);
  const [openItemWeightMod, setOpenItemWeightMod] = useState(false);
  const [modItem, setModItem] = useState({});
  const getGuideItemCarb = (modItemId) =>
    carbAndWeightGuide.find((guideItem) => modItemId === guideItem.id)?.carb;
  const handleOpen = () => setOpenItemMod(true);
  const handleClose = () => setOpenItemMod(false);

  const modifyQty = (qty) => {
    setGuideSelected((prev) => {
      const existingItem = carbAndWeightGuide.find(
        (item) => modItem.id === item.id
      );

      // If the item exists in guideSelected, update its carb property
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          carb: existingItem.carb * qty,
        };

        // Remove the old item and add the updated one
        return prev
          .filter((item) => item.id !== modItem.id)
          .concat(updatedItem);
      }

      // If the item doesn't exist, add it to guideSelected
      return [
        ...prev,
        { ...modItem, carb: getGuideItemCarb(modItem.id) * qty },
      ];
    });
    setModItem((prev) => ({
      ...prev,
      carb: getGuideItemCarb(prev.id) * qty,
    }));
  };

  const modifyWeight = (weight) => {
    setGuideSelected((prev) => {
      const existingItem = carbAndWeightGuide.find(
        (item) => modItem.id === item.id
      );

      // If the item exists in guideSelected, update its carb property
      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          carb: existingItem.calc * weight,
          weight: weight,
        };

        // Remove the old item and add the updated one
        return prev
          .filter((item) => item.id !== modItem.id)
          .concat(updatedItem);
      }

      // If the item doesn't exist, add it to guideSelected
      return [
        ...prev,
        { ...modItem, carb: modItem.calc * weight, weight: weight },
      ];
    });
    setModItem((prev) => ({
      ...prev,
      carb: prev.calc * weight,
      weight: weight,
    }));
  };

  const [meal, showMeal] = useState(true);
  const [mealItems, showMealItems] = useState(false);
  const [mealDose, showMealDose] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  const convertToPositive = (number) => {
    // return number < 0 ? Math.abs(number) : number;
    return Math.abs(number);
  };

  return (
    <Grid container spacing={3}>
      {meal && (
        <Grid item xl={6}>
          <h2>جرعة الطعام</h2>
          {showWarning && (
            <Alert
              severity="warning"
              className="info-callout"
              onClose={() => setShowWarning(false)}
              sx={{ maxWidth: 600 }}
            >
              معظم الأصناف محددة الكارب مسبقا حسب الكمية الموضحة لها، ويمكن
              تعديل كمياتها، وهناك القليل من الأصناف غير محددة الكارب والتي يجب
              إدخال وزن كميتها بالغرامات ليحسب التطبيق مقدار الكارب الذي تحتوي
              عليه.
            </Alert>
          )}
          <h3>حدد الأطعمة والمشروبات</h3>
          <Grid
            item
            style={{ width: 250, display: "flex", flexDirection: "column" }}
          >
            <MultiSelect
              options={options}
              value={selected}
              onChange={setSelected}
              labelledBy="حدد"
              // ItemRenderer={""}
              valueRenderer={customValueRenderer}
              hasSelectAll={false}
              overrideStrings={{
                allItemsAreSelected: "جميع الأصناف محددة.",
                clearSearch: "delete-search",
                clearSelected: "حذف المحدد",
                noOptions: "لا خيارات",
                search: "بحث",
                selectAll: "اختر الجميع",
                selectAllFiltered: "اختر الجميع (مرشح)",
                selectSomeItems: "اختر...",
                create: "أنشأ",
              }}
            />
            <Button
              style={{ marginTop: 20 }}
              variant="contained"
              onClick={() => {
                setGuideSelected(
                  selected.map((item) =>
                    carbAndWeightGuide.find(
                      (guideItem) => item.value === guideItem.id
                    )
                  )
                );
                showMealItems(true);
                showMeal(false);
              }}
              disabled={selected.length < 1}
            >
              تم التحديد
            </Button>
          </Grid>
        </Grid>
      )}

      <Grid container>
        {mealItems && (
          <Grid item xl={12}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {title}{" "}
              <RedoIcon
                onClick={() => {
                  showMeal(true);
                  showMealItems(false);
                }}
                titleAccess="عد إلى تحديد الأصناف"
              />
            </h3>
            <Alert severity="info" className="info-callout">
              <AlertTitle>هل تعلم؟</AlertTitle>
              <li>
                يمكنك تعديل كميات الأصناف محسوبة الكارب بالضغط على أيقونة
                الحاسبة <CalculateIcon fontSize="2rem" /> بجانب كل صنف.
              </li>
              <li>
                أما الأصناف غير محددة الكارب فيمكنك ضبط أوزانها بالضغط على
                أيقونة الميزان <ScaleIcon fontSize="20px" /> بجانب كل صنف.
              </li>
            </Alert>

            <ul style={{ lineHeight: 2, padding: 0 }}>
              {selected.map((item, index) => {
                const guideItem = guideSelected.find(
                  (guideItem) => guideItem.id === item.value
                );

                // Check if guideItem is found before rendering the list item
                return guideItem ? (
                  <Grid
                    container
                    key={index}
                    gap={1}
                    marginY={1}
                    justifyContent="space-between"
                    className="selected-item-view"
                  >
                    <li style={{ display: "flex", alignItems: "center" }}>
                      <Typography>
                        {index + 1}. {guideItem.item}{" "}
                        {!guideItem.calc
                          ? `| ${guideItem.qty} | (${guideItem.carb}ك)`
                          : guideItem.carb
                          ? `${
                              guideItem.weight && `| ${guideItem.weight} غرام`
                            } | (${Math.round(guideItem.carb)}ك)`
                          : ""}
                      </Typography>
                      {!guideItem.calc ? (
                        <CalculateIcon
                          sx={{ mr: 1 }}
                          onClick={() => {
                            setModItem(guideItem);
                            setOpenItemMod(true);
                          }}
                        />
                      ) : (
                        <ScaleIcon
                          sx={{ mr: 1 }}
                          onClick={() => {
                            setModItem(guideItem);
                            setOpenItemWeightMod(true);
                          }}
                        />
                      )}
                    </li>
                  </Grid>
                ) : null;
              })}
            </ul>
            <Button
              variant="contained"
              onClick={() => {
                calculateTotalCarb();
              }}
            >
              احسب الجرعة
            </Button>
          </Grid>
        )}

        {mealDose && (
          <Grid item xl={6} container direction="column" gap={1}>
            <h3 style={{ display: "flex", alignItems: "center", gap: 6 }}>
              جرعة الطعام{" "}
              <RedoIcon
                onClick={() => {
                  showMealItems(true);
                  showMealDose(false);
                }}
                titleAccess="عد إلى مراجعة الأصناف"
              />
            </h3>
            <Chip
              className="dose-chip"
              icon={<VaccinesIcon />}
              label={unitGrammar(
                selected && selected.length > 0 ? Math.round(insulinDose) : 0
              )}
              variant="outlined"
              sx={{ maxWidth: 200 }}
            />
            <img src={randomDoseImg} width={200} style={{ borderRadius: 5 }} />
          </Grid>
        )}
      </Grid>

      <Dialog
        open={openItemMod}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="item-mod-modal"
      >
        <DialogTitle>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modItem.item}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-description">
            <li>الكمية: {modItem.qty}</li>
            <li>الكربوهيدرات: {modItem.carb} غرام</li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={1}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button variant="contained" onClick={() => modifyQty(0.25)}>
                25%
              </Button>
              <Button variant="contained" onClick={() => modifyQty(0.5)}>
                50%
              </Button>
              <Button variant="contained" onClick={() => modifyQty(0.75)}>
                75%
              </Button>
              <Button variant="contained" onClick={() => modifyQty(1)}>
                100%
              </Button>
            </Grid>

            <Grid
              item
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button variant="contained" onClick={() => modifyQty(1.5)}>
                150%
              </Button>
              <TextField
                className="qty-num-input-field"
                label="عدد"
                variant="outlined"
                sx={{ width: 100 }}
                onChange={(e) => modifyQty(Math.abs(e.target.value))}
                type="number"
              />
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openItemWeightMod}
        onClose={() => setOpenItemWeightMod(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="item-mod-modal"
      >
        <DialogTitle>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modItem.item}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-description">
            <li>معامل الضرب: {modItem.calc}</li>
            <li>الكربوهيدرات: {Math.round(modItem.carb)} غرام</li>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={1}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <FormControl sx={{ width: 150 }} variant="outlined">
              <OutlinedInput
                className="qty-num-input-field"
                id="outlined-adornment-weight"
                endAdornment={<InputAdornment position="end">غ</InputAdornment>}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
                type="number"
                onChange={(e) => modifyWeight(Math.abs(e.target.value))}
              />
              <FormHelperText id="outlined-weight-helper-text">
                الوزن
              </FormHelperText>
            </FormControl>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EatingDose;
