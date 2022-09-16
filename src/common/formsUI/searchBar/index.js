import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from "@mui/icons-material/Directions";
import { useFormikContext } from "formik";

export default function SearchBar({
    setSearchQuery,
    placeholder,
    ...otherProps
}) {
    let [input, setInput] = React.useState();

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleSearch = async () => {
        setSearchQuery(input);
    };

    return (
        <Paper
            component="form"
            sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: "auto",
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={placeholder}
                onChange={handleInputChange}
            />
            <IconButton
                type="submit"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={handleSearch}
            >
                <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
    );
}
