import "./TTK.css"
import {useEffect, useState} from "react";
import API from "./API"
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import {Button, Divider, Typography} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

function TTK() {
    const [rake, setRake] = useState(null);
    const [gpt, setGPT] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingGPT, setIsLoadingGPT] = useState(false)
    const [isLoadingRAKE, setIsLoadingRake] = useState(false)
    const [form, setForm] = useState({
        title: "Swiss Standard Classification of Occupations CH-ISCO-19 v.1.1",
        description: "The Swiss Standard Classification of Occupations CH-ISCO-19 continues to use the first four levels of the International Standard Classification of Occupations ISCO-08 and includes an additional fifth level to take account of the particularities of the labour market in Switzerland. It also contains the occupation titles attributed to each category. These occupational titles group together the occupations most often mentioned in FSO surveys, those consulted by professional and managerial associations and the official titles listed by the State Secretariat for Education, Research and Innovation (SERI). This list is updated regularly.",
        topics: "Labour, Official statistics",
        publisher: "Federal Statistical Office"
    });

    useEffect(() => {
        function onTxt2KeyEvent(){
            window.addEventListener("txt2key", function (event) {
                if(event.detail.type === "response" && event.detail.complete){
                    console.log("got txt2key response event", event);
                    setIsLoading(false);
                    try {
                        let gpt = event.detail.data.filter(d => d.type === "gpt")[0].data.keywords;
                        setGPT(gpt)
                        setIsLoadingGPT(false)
                    } catch (e){
                        console.error("error", e);
                    }
                    try {
                        let rake = event.detail.data.filter(d => d.type === "rake")[0].data;
                        setRake(rake)
                        setIsLoadingRake(false)
                    } catch (e){
                        console.error("error", e);
                    }
                }
                if(event.detail.type === "response" && event.detail.complete === false){
                    console.log("got txt2key partial response event", event);
                    try {
                        let gpt = event.detail.data.filter(d => d.type === "gpt")[0].data.keywords;
                        setGPT(gpt)
                        setIsLoadingGPT(false)
                    } catch (e){
                        console.error("error", e);
                    }
                    try {
                        let rake = event.detail.data.filter(d => d.type === "rake")[0].data;
                        setRake(rake)
                        setIsLoadingRake(false)
                    } catch (e){
                        console.error("error", e);
                    }
                }
            });
        }
        const init = async () => {
            onTxt2KeyEvent();
        }
        init();
        return () => {
            window.removeEventListener("txt2key", onTxt2KeyEvent)
        }
    }, [])
    return (
        <div
            className="TTK"
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            `}
        >
            <div>
                <Typography variant={"h3"} style={{marginBottom: "20px"}}>Txt2Key Demo</Typography>
            </div>
            <div>
                <div
                    css={css`
                  display: flex;
                `}
                >
                    <div
                        css={css`
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                `}
                    >
                        <Typography variant={"h5"} style={{marginBottom: 15}}>Input</Typography>
                        <Box mt={5}/>
                        <div style={{minWidth: "40vw", maxWidth: "800px"}}>
                            <TextField
                                id="outlined-basic"
                                label="Title"
                                variant="outlined"
                                fullWidth
                                value={form.title}
                                onChange={(event)=>{
                                    setForm({
                                        ...form,
                                        title: event.target.value
                                    })
                                }}
                            />
                            <Box mt={2}/>
                            <TextField
                                id="outlined-basic"
                                label="Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={form.description}
                                onChange={(event)=>{
                                    setForm({
                                        ...form,
                                        description: event.target.value
                                    })
                                }}
                            />
                            <Box mt={2}/>
                            <TextField
                                id="outlined-basic"
                                label="Topics"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={4}
                                value={form.topics}
                                onChange={(event)=>{
                                    setForm({
                                        ...form,
                                        topics: event.target.value
                                    })
                                }}
                            />
                            <Box mt={2}/>
                            <TextField
                                id="outlined-basic"
                                label="Publisher"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={form.publisher}
                                onChange={(event)=>{
                                    setForm({
                                        ...form,
                                        publisher: event.target.value
                                    })
                                }}
                            />
                            <Box mt={2}/>
                            <LoadingButton  loading={isLoading} fullWidth onClick={()=>{
                                /* Broadcast the event to the host so that the UI can be updated */
                                setIsLoading(true)
                                setIsLoadingRake(true)
                                setIsLoadingGPT(true)
                                window.dispatchEvent(
                                    new CustomEvent("txt2key", { detail: {
                                            type: "request",
                                            data: {
                                                form: {
                                                    ...form,
                                                    topics: form.topics.split(",").map(t => t.trim())
                                                }
                                            }
                                        }})
                                );
                            }}>Extract Keys</LoadingButton >
                        </div>
                    </div>
                    <Box ml={2} mr={2}/>
                    <div
                        css={css`
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                `}
                    >
                        <Typography variant={"h5"} style={{marginBottom: 15}}>Output</Typography>
                        <Box mt={5}/>
                        <div style={{minWidth: "40vw", maxWidth: "800px"}}>
                            <Typography variant={"h6"}>
                                RAKE
                            </Typography>
                            {
                                isLoadingRAKE ? <LinearProgress variant={"indeterminate"} /> : (
                                    <Typography variant={"body1"}>
                                        {
                                            (()=>{
                                                try {
                                                    if(rake){
                                                        return rake?.map(d => d.keyword).join(", ")
                                                    }
                                                } catch (e){
                                                    return e.message
                                                }
                                            })()
                                        }
                                    </Typography>
                                )
                            }
                            <Divider style={{margin: "15px"}}></Divider>
                            <Typography variant={"h6"}>
                                GPT
                            </Typography>
                            {
                                isLoadingGPT ? <LinearProgress variant={"indeterminate"} />  : (
                                    <Typography variant={"body1"}>
                                        {
                                            (()=>{
                                                try {
                                                    if(gpt){
                                                        return gpt.map(d => d.keyword).join(", ")
                                                    }
                                                } catch (e){
                                                    return e.message
                                                }
                                            })()
                                        }
                                    </Typography>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TTK;