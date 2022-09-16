import { Box, Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import { ReactReduxContext } from "react-redux";

export const QuestionDetailsDialog = ({ type, content, open, handleClose }) => {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "white",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    let answers = [];

    const renderMultiChoice = () => {
        let answers = [];
        content.correctAnswersIndexes.map((x) => {
            answers.push(content.answers[x]);
        });

        return (
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {`Točni odgovori: ${answers.join(`, `)}`}
            </Typography>
        );
    };

    const renderQuestion = () => {
        if (type == "true/false") {
            return (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {`Odgovor: ${
                        content.correctAnswer === "true" ? "Točno" : "Netočno"
                    }`}
                </Typography>
            );
        } else if (type == "singleWord") {
            return (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {`Točni odgovori: ${content.correctAnswers.join(`, `)}`}
                </Typography>
            );
        } else if (type == "singleChoice") {
            return (
                <div key={"singleChoiceModal"}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {`Ponuđeni odgovori: ${content.answers.join(`, `)}`}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {`Točan odgovor: ${
                            content.answers[content.correctAnswerIndex]
                        }`}
                    </Typography>
                </div>
            );
        } else if (type == "multiChoice") {
            return (
                <div key={"multiChoiceModal"}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {`Ponuđeni odgovori: ${content.answers.join(`, `)}`}
                    </Typography>
                    {renderMultiChoice()}
                </div>
            );
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        {content.stem}
                    </Typography>
                    {renderQuestion()}
                </Box>
            </Modal>
        </div>
    );
};
