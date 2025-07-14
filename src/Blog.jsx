import { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline,
  Stack,
} from "@mui/material";
import {
  useMediaQuery,
  useTheme,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";

const tableStyles = {
  container: {
    width: "100%",
    margin: "auto",
    overflowX: "auto",
    maxWidth: "100%",
  },
  table: {
    minWidth: 650,
    "@media (max-width: 600px)": {
      "& .MuiTableCell-root": {
        padding: "8px",
        fontSize: "0.75rem",
      },
      "& .MuiTableCell-head": {
        fontSize: "0.85rem",
        backgroundColor: "#f5f5f5",
        position: "sticky",
        top: 0,
        zIndex: 1,
      },
    },
  },
};

// New footer styles
const footerStyles = {
  footer: {
    position: "relative",
    bottom: 0,
    width: "100%",
    py: 2,
    mt: 4,
    backgroundColor: (theme) => theme.palette.background.paper,
    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
  },
  footerContent: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 1,
  },
  footerLink: {
    color: (theme) => theme.palette.text.primary,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
};

const BlogSpot = () => {
  const themeMUI = useTheme();
  const isMobile = useMediaQuery(themeMUI.breakpoints.down("sm"));

  const initialPosts = [
    {
      id: 1,
      title: "Digital India: Transforming Governance Through Technology",
      author: "Priya Sharma",
      date: "2023-10-15",
      status: "Published",
      content:
        "Explore how Digital India initiatives are revolutionizing public services and citizen engagement across the country...",
    },
    {
      id: 2,
      title: "The Rise of Indian Startups in Fintech",
      author: "Arjun Patel",
      date: "2023-10-20",
      status: "Draft",
      content:
        "Analyze the explosive growth of Indian fintech companies and their impact on financial inclusion...",
    },
    {
      id: 3,
      title: "Sustainable Agriculture Practices in Rural India",
      author: "Dr. Kavitha Reddy",
      date: "2023-10-25",
      status: "Published",
      content:
        "Discover innovative farming techniques helping Indian farmers increase productivity while preserving the environment...",
    },
    {
      id: 4,
      title: "Indian Classical Music in the Digital Age",
      author: "Ravi Iyer",
      date: "2023-11-01",
      status: "Published",
      content:
        "How traditional Indian ragas and classical music are finding new audiences through digital platforms...",
    },
    {
      id: 5,
      title: "Ayurveda and Modern Healthcare: Bridging Ancient Wisdom",
      author: "Dr. Meera Gupta",
      date: "2023-11-05",
      status: "Draft",
      content:
        "Examining the integration of Ayurvedic principles with contemporary medical practices in India...",
    },
    {
      id: 6,
      title: "The Indian Space Program: From Aryabhata to Chandrayaan",
      author: "Vikram Singh",
      date: "2023-11-10",
      status: "Published",
      content:
        "Tracing ISRO's remarkable journey and India's growing prominence in space exploration...",
    },
    {
      id: 7,
      title: "Street Food Culture: A Culinary Journey Through India",
      author: "Anjali Bhatt",
      date: "2023-11-15",
      status: "Published",
      content:
        "Celebrating the diverse flavors and cultural significance of Indian street food across different regions...",
    },
    {
      id: 8,
      title: "Renewable Energy Revolution in India",
      author: "Karthik Nair",
      date: "2023-11-20",
      status: "Draft",
      content:
        "Investigating India's ambitious renewable energy targets and the technology driving this transformation...",
    },
    {
      id: 9,
      title: "Bollywood's Global Influence and Cultural Diplomacy",
      author: "Pooja Malhotra",
      date: "2023-11-25",
      status: "Published",
      content:
        "Analyzing how Indian cinema has become a powerful tool for cultural exchange and soft diplomacy...",
    },
    {
      id: 10,
      title: "Traditional Handicrafts in Modern E-commerce",
      author: "Suresh Kumar",
      date: "2023-12-01",
      status: "Published",
      content:
        "How Indian artisans are leveraging digital platforms to preserve and promote traditional crafts...",
    },
    {
      id: 11,
      title: "A Guide to UPI Integration in Web Apps",
      author: "Sneha Nair",
      date: "2024-05-21",
      status: "Draft",
      content:
        "Learn how to integrate UPI-based payments into your web applications using IndiaStack and Razorpay APIs.",
    },
  ];

  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem("posts");
    const parsed = stored ? JSON.parse(stored) : [];

    // Merge while avoiding duplicates by id
    const merged = [...parsed];

    initialPosts.forEach((initial) => {
      if (!parsed.some((post) => post.id === initial.id)) {
        merged.push(initial);
      }
    });

    return merged;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "asc",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [themeMode, setThemeMode] = useState("light");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [form, setForm] = useState({
    title: "",
    author: "",
    content: "",
    status: "Draft",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const theme = useMemo(
    () => createTheme({ palette: { mode: themeMode } }),
    [themeMode]
  );

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
  };

  const sortedPosts = useMemo(() => {
    return [...posts]
      .filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [posts, searchTerm, sortConfig]);

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, val]) => {
      if (!val.trim()) newErrors[key] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (editPost) {
      // Correctly preserve the original post ID and date
      const updated = posts.map((p) =>
        p.id === editPost.id ? { ...p, ...form } : p
      );
      setPosts(updated);
    } else {
      // Add new post
      setPosts([
        ...posts,
        { ...form, id: Date.now(), date: new Date().toLocaleDateString() },
      ]);
    }

    // Reset state
    setForm({ title: "", author: "", content: "", status: "Draft" });
    setErrors({});
    setEditPost(null);
    setOpenDialog(false);
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      author: post.author,
      content: post.content,
      status: post.status,
    });
    setErrors({});
    setEditPost(post);
    setOpenDialog(true);
  };

  const handleDelete = () => {
    setPosts(posts.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth={false} disableGutters>
          <Toolbar>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: "100%", px: 2 }}
            >
              <Typography variant="h6">Blog Spot</Typography>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  flexGrow: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                  ml: { md: 2 },
                }}
              >
                {!isMobile && (
                  <TextField
                    label="Search by title or author"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      backgroundColor: "white",
                      width: { xs: "100%", md: "300px" },
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<Add sx={{ p: 0, m: 0 }} />}
                  onClick={() => {
                    setEditPost(null);
                    setForm({
                      title: "",
                      author: "",
                      content: "",
                      status: "Draft",
                    });
                    setErrors({});
                    setOpenDialog(true);
                  }}
                  sx={{
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.dark" },
                    ...(isMobile
                      ? {
                          minWidth: "40px",
                          p: 0.5,
                          "& .MuiButton-startIcon": { m: 0 }, // Remove margin from startIcon in mobile view
                        }
                      : { px: 2, py: 0.5 }),
                  }}
                >
                  {isMobile ? "" : "Add Post"}
                </Button>
                <IconButton
                  onClick={() =>
                    setThemeMode((prev) =>
                      prev === "light" ? "dark" : "light"
                    )
                  }
                  sx={{ color: "white" }}
                >
                  {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
                </IconButton>
              </Stack>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editPost ? "Edit" : "Add"} Post</DialogTitle>
        <DialogContent>
          {["title", "author", "content"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, [field]: e.target.value }))
              }
              error={!!errors[field]}
              helperText={errors[field]}
              multiline={field === "content"}
              rows={field === "content" ? 4 : 1}
            />
          ))}
          <TextField
            margin="dense"
            fullWidth
            select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value }))
            }
            error={!!errors.status}
            helperText={errors.status}
            size="small"
          >
            {["Draft", "Published"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editPost ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{deleteConfirm?.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table / Card View */}
      <Container
        maxWidth={false}
        sx={{ pt: 5, minHeight: "calc(100vh - 128px)" }}
      >
        <div style={tableStyles.container}>
          {isMobile ? (
            <>
              <TextField
                label="Search by title or author"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  width: { xs: "100%", md: "300px" },
                  mt: 3,
                }}
              />
              <Stack spacing={2} sx={{ pt: 3 }}>
                {sortedPosts.length > 0 ? (
                  sortedPosts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((post) => (
                      <Paper key={post.id} sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          <strong>Title:</strong> {post.title}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Author:</strong> {post.author}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Date:</strong> {post.date}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2">
                            <strong>Status:</strong>
                          </Typography>
                          <Chip
                            label={post.status}
                            color={post.status == "Draft" ? "" : "success"}
                          />
                        </Box>{" "}
                        <Box mt={1}>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => setDeleteConfirm(post)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))
                ) : (
                  <Typography align="center">No posts found.</Typography>
                )}
              </Stack>
            </>
          ) : (
            <>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["title", "author", "date", "status"].map((col) => (
                      <TableCell key={col}>
                        {["title", "date"].includes(col) ? (
                          <TableSortLabel
                            active={sortConfig.key === col}
                            direction={
                              sortConfig.key === col
                                ? sortConfig.direction
                                : "asc"
                            }
                            onClick={() => handleSort(col)}
                          >
                            {col.charAt(0).toUpperCase() + col.slice(1)}
                          </TableSortLabel>
                        ) : (
                          col.charAt(0).toUpperCase() + col.slice(1)
                        )}
                      </TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedPosts.length > 0 ? (
                    sortedPosts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>{post.title}</TableCell>
                          <TableCell>{post.author}</TableCell>
                          <TableCell>{post.date}</TableCell>
                          <TableCell>
                            {" "}
                            <Chip
                              label={post.status}
                              color={post.status == "Draft" ? "" : "success"}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(post)}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => setDeleteConfirm(post)}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No posts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
          <TablePagination
            component="div"
            count={sortedPosts.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage={isMobile ? "Rows:" : "Rows per page:"}
            labelDisplayedRows={({ from, to, count }) =>
              isMobile
                ? `${from}-${to} of ${count}`
                : `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              maxWidth: "100%",
              overflow: "hidden",
            }}
          />
        </div>
      </Container>

      {/* Footer */}
      <Box sx={footerStyles.footer}>
        <Container maxWidth={false}>
          <Box sx={footerStyles.footerContent}>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Blog Spot. All rights reserved.
            </Typography>
            <Typography variant="body2">
              <a href="/contact" style={footerStyles.footerLink}>
                Contact Us
              </a>
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default BlogSpot;
