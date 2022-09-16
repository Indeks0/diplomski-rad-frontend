import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import React from "react";

export const SubjectNoticeDialog = ({ notice, open, handleClose }) => {
    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h4" textAlign="center">
                    {notice.title}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ maxHeight: 400 }}>
                <Box
                    sx={{
                        borderTop: 1,
                        borderBottom: 1,
                    }}
                >
                    <Typography
                        className="ck-content"
                        dangerouslySetInnerHTML={{
                            __html: notice.description,
                        }}
                    ></Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Izlaz
                </Button>
            </DialogActions>
        </Dialog>
    );
};
