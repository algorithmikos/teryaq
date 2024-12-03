import React, { useEffect, useState } from "react";
import "./Guide.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Alert,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGuideItem,
  setGuide,
  fetchGuide,
  updateGuideItem,
} from "../../rtk/slices/guide-slice";
import Loader from "../../components/Loader/Loader";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ItemUpdateForm from "./ItemUpdateForm";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import SearchBar from "./SearchBar";

const Guide = () => {
  const dispatch = useDispatch();
  const guide = useSelector((state) => state.guide.carbGuide);
  const hardcoded = useSelector((state) => state.guide.hardcoded);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [searchWord, setSearchWord] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const filteredGuide = guide.filter((item) => {
    const hasSearchWord = item.item.includes(searchWord);
    const hasSelectedTags =
      selectedTags.length > 0 &&
      selectedTags.some((tag) => item.tags.includes(tag));
    return hasSearchWord && (hasSelectedTags || !selectedTags.length);
  });
  let sortedGuide = [...filteredGuide].sort((a, b) => {
    return a.item.localeCompare(b.item);
  });
  const currentItems = sortedGuide.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    dispatch(setGuide()).then(() => {
      if (hardcoded) {
        setIsEmpty(true);
      }
    });
    // dispatch(fetchGuide());
  }, []);

  const handleDeleteItem = async (itemId) => {
    await toast.promise(deleteDoc(doc(db, "carb_guide", itemId)), {
      pending: "جار حذف الصنف",
      success: "تم حذف الصنف",
      error: "ثمة خطأ في الاتصال بقاعدة البيانات أو في اتصالك بالشابكة",
    });

    dispatch(deleteGuideItem(itemId));
    dispatch(setGuide()).then(() => {
      if (hardcoded) {
        setIsEmpty(true);
      }
    });
    setShowDeleteDialog(false);
  };

  const handleUpdateItem = async (itemId, updatedData) => {
    try {
      setIsWaiting(true);
      const docRef = doc(db, "carb_guide", itemId);

      await toast.promise(updateDoc(docRef, updatedData), {
        pending: "جار تحديث الصنف",
        success: "تم تحديث الصنف",
        error: "ثمة خطأ في الاتصال بقاعدة البيانات أو في اتصالك بالشابكة",
      });

      dispatch(updateGuideItem({ itemId, updatedData }));
      dispatch(setGuide()).then(() => {
        if (hardcoded) {
          setIsEmpty(true);
        }
      });
      setShowUpdateDialog(false);
      setIsWaiting(false);
    } catch (error) {
      setIsWaiting(false);
      console.log(error.code, error.message);
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [isEmpty, setIsEmpty] = useState(false);
  const [displayAlerts, setDisplayAlerts] = useState(true);

  const [isWaiting, setIsWaiting] = useState(false);

  const { item, qty, carb, type, tags } = selectedItem;

  const [showFilters, setShowFilters] = useState(false);

  return guide.length > 0 ? (
    <Grid container justifyContent="center" alignItems="center" rowGap={2}>
      <Grid item>
        <Typography variant="h6">
          ثمة {guide.length} صنفا في قاعدة بيانات ترياق{" "}
          {hardcoded ? "المدمجة" : ""}
        </Typography>
      </Grid>

      {/* Filter by tags */}
      <Grid item container gap={1} justifyContent="center">
        <Button
          variant="contained"
          onClick={() => {
            setShowFilters(!showFilters);
            if (showFilters) {
              setSelectedTags([]);
            }
          }}
          className="filter-button"
        >
          {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
        </Button>
        {showFilters && (
          <>
            <Button
              variant="contained"
              onClick={() => setSelectedTags([])}
              disabled={selectedTags.length === 0}
              className="remove-filter-button"
            >
              إزالة الفلاتر
            </Button>
            {guide
              .reduce((allTags, item) => [...allTags, ...item.tags], [])
              .filter((tag, index, array) => array.indexOf(tag) === index)
              .map((tag) => (
                <Button
                  key={tag}
                  variant={
                    selectedTags.includes(tag) ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={() =>
                    setSelectedTags((prevTags) =>
                      prevTags.includes(tag)
                        ? prevTags.filter((t) => t !== tag)
                        : [...prevTags, tag]
                    )
                  }
                >
                  {tag}
                </Button>
              ))}
          </>
        )}
      </Grid>
      {/* End Filter by tags */}

      {/* Search Bar */}
      <Grid item container gap={1} justifyContent="center">
        <SearchBar
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          placeholder="ابحث عن صنف"
        />
      </Grid>
      {/* End of Search Bar */}

      {displayAlerts && isEmpty && (
        <Grid item container gap={1}>
          <Alert
            severity="error"
            className="info-callout"
            onClose={() => setDisplayAlerts(false)}
          >
            هذه الأصناف ليست من آخر تحديث لقاعدة بياناتنا بالضرورة. إما أنه:
            <ol>
              <li>قد حدث خطأ أثناء إنشاء حسابك.</li>
              <li>أو أنك قمت بحذف بيانات المتصفح.</li>
              <li>أو سجلت دخولك من متصفح جديد.</li>
            </ol>
            مما أدى إلى:
            <li>فقدان النسخة التي حصلت عليها عند إنشاء الحساب.</li>
            يمكنك:
            <li>محاولة تحديث الدليل الغذائي عبر الضغط على زر تحديث.</li>
          </Alert>
          <Alert severity="info" className="info-callout">
            علما بأنه نظرا لمحدودية الموارد المجانية التي يعتمد عليها تشغيل
            ترياق فإن الحسابات المجانية غير قادرة على طلب تحديث أكثر من مرتين كل
            24 ساعة تامة.
          </Alert>
          <Alert severity="warning" className="info-callout">
            في أوقات الضغط على الخادوم المشغل لترياق قد يتعطل زر التحديث تلقائيا
            إلى حين مرور 24 ساعة حتى لو لم تكن قد استهلكت التحديثين المتاحين
            لحسابك.
          </Alert>
        </Grid>
      )}

      <Grid item>
        <Grid container justifyContent="center">
          {currentItems.map((item) => (
            <Card sx={{ width: 250 }} key={item.id} className="mrl-10 mb-30">
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.item}
                </Typography>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {item.qty}
                </Typography>
                <Typography variant="body" component="div">
                  الكربوهيدرات: {item.carb} غرام
                </Typography>
              </CardContent>
              {/* <CardActionArea> */}
              <Grid container justifyContent="space-evenly" mb={2}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowUpdateDialog(true);
                  }}
                >
                  <ModeEditIcon />
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDeleteDialog(true);
                  }}
                >
                  <DeleteForeverIcon />
                </Button>
              </Grid>
              {/* </CardActionArea> */}
            </Card>
          ))}
          {/* Pagination controls */}
          <Grid item container justifyContent="center" mt={2} gap={1}>
            <Grid item width="100%" textAlign="center">
              الصفحة
            </Grid>
            {Array.from(
              { length: Math.ceil(filteredGuide.length / itemsPerPage) },
              (_, index) => (
                <Button
                  key={index + 1}
                  variant={currentPage === index + 1 ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              )
            )}
          </Grid>
          {/* End of Pagination controls */}
        </Grid>
      </Grid>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        className="item-mod-modal"
      >
        <DialogTitle>حذف صنف</DialogTitle>
        <DialogContent>
          هل أنت متأكد من أنك تريد حذف{" "}
          <span style={{ fontWeight: "bold" }}>{selectedItem.item}</span>؟
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => handleDeleteItem(selectedItem.id)}
          >
            نعم. احذف الصنف.
          </Button>
          <Button onClick={() => setShowDeleteDialog(false)}>ألغ الأمر</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        className="item-mod-modal"
      >
        <DialogTitle>تعديل صنف</DialogTitle>
        <DialogContent>
          <ItemUpdateForm
            formData={selectedItem}
            setFormData={setSelectedItem}
          />
        </DialogContent>
        <DialogActions>
          <Grid container gap={1} justifyContent="end">
            <LoadingButton
              loading={isWaiting}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              color="success"
              onClick={() => handleUpdateItem(selectedItem.id, selectedItem)}
              disabled={!item || !qty || !carb || !type || tags.length < 1}
            >
              حفظ الصنف
            </LoadingButton>
            <Button
              variant="contained"
              onClick={() => setShowUpdateDialog(false)}
            >
              إلغاء الأمر
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  ) : (
    <Loader text="جار تحميل الأصناف..." />
  );
};

export default Guide;
