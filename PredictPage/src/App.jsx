import * as React from 'react';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'; // Grid version 1
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import data from './data.json';
import useStore from './store';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InputIcon from '@mui/icons-material/Input';
import { Slider } from '@mui/material';
import { Box } from '@mui/material';
import backgroundImage from './assets/background.jpg';
import { Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Confetti from 'react-confetti';
import EmogiRain from './function/emogiRain';
import { useReward } from 'react-rewards';
import NotaVisual from './function/nota';


const cursoEdades = {
  1: [5, 6, 7],
  2: [6, 7, 8],
  3: [7, 8, 9],
  4: [8, 9, 10],
  5: [9, 10, 11],
  6: [10, 11, 12],
  7: [11, 12, 13],
  8: [12, 13, 14],
  9: [13, 14, 15],
  10: [14, 15, 16],
  11: [15, 16, 17],
  12: [16, 17, 18],
};

export default function App() {
  const { comuna, dependencia, prediction, edadesPermitidas, genero, open, curso, age, setComuna, setEdadesPermitidas, asistencia, setPrediction, setDependencia, setOpen, setGenero, setEnseñanza, setCursos, setCurso, setAge, setAsistencia } = useStore();
  const enseñanza = useStore(state => state.enseñanza);
  const cursos = useStore(state => state.cursos);
  const allFieldsFilled = comuna && dependencia && genero && enseñanza && curso && age && asistencia;

  const {reward: emojiReward, isAnimating: isEmojiAnimating} = useReward('emojiReward', 'emoji', {
    lifetime: 300, // duration of the animation in milliseconds
  });

  const filtrarEdades = () => {
    if (curso) {
      setEdadesPermitidas(cursoEdades[curso.id]);
    } else {
      setEdadesPermitidas([]);
    }
  };

  const handleSubmit = async () => {  
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          comuna: comuna.id,
          dependencia: dependencia.id,
          genero: genero.id,
          enseñanza: enseñanza.id,
          curso: curso.id,
          age: age,
          asistencia: asistencia,
        },
      }),
    });
  
    setPrediction(await response.json());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const filtrarCursos = () => {
    if (enseñanza && enseñanza.id == 2) {
      setCursos(data.curso.filter((curso) => curso.id <= 8));
    } else if (enseñanza && (enseñanza.id == 5 || enseñanza.id == 7)) {
      setCursos(data.curso.filter((curso) => curso.id >= 9));
    } else {
      setCursos([]);
    }
  };
  
  useEffect(() => {
    filtrarCursos();
  }, [enseñanza]);

  useEffect(() => {
    filtrarEdades();
  }, [curso]);

  return (
    <div className='App' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh', width: '100vw' }}>
      {prediction < 4.9 && prediction > 1 && <EmogiRain />}
      {prediction > 5.9 && <Confetti />}
      <div style={{ paddingTop: '30vh', position: 'relative', zIndex: 2 }}>
      <Container maxWidth='md' >
        <Box sx={{ bgcolor: '#ffffff', boxShadow: 16, p: 2, borderRadius: 0, overflow: 'hidden'}}>
          <Grid container spacing={2} columns={16} >
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id='comuna'
              options={data.comunas}
              getOptionLabel={(option) => option.name}
              value={comuna}
              onChange={(event, newValue) => setComuna(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Comuna' required/>}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id='dependencia'
              options={data.dependencia}
              getOptionLabel={(option) => option.name}
              value={dependencia}
              onChange={(event, newValue) => setDependencia(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Dependencia' required/>}
              required
            />
          </Grid>
          <Grid item xs={8}>
          <Autocomplete
            disablePortal
            id='enseñanza'
            options={data.enseñanza}
            getOptionLabel={(option) => option.name}
            value={enseñanza}
            onChange={(event, newValue) => {
              setEnseñanza(newValue ? newValue : { id: null, name: '' });
              setCurso(null); // Resetea curso cuando enseñanza cambia
              setEdadesPermitidas([]); // Resetea edades cuando enseñanza cambia
              setAge(null); // Resetea edad cuando enseñanza cambia
            }}
            renderInput={(params) => <TextField {...params} label='Enseñanza' required/>}
            required
          />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id='curso'
              options={cursos}
              getOptionLabel={(option) => option.name}
              value={curso}
              onChange={(event, newValue) => {
                setCurso(newValue ? newValue : { id: null, name: '' });
                filtrarEdades();  
                setAge(null); // Resetea edad cuando curso cambia            
              }}
              renderInput={(params) => <TextField {...params} label='Curso' required/>}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              id='genero'
              options={data.genero}
              getOptionLabel={(option) => option.name}
              value={genero}
              onChange={(event, newValue) => setGenero(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Genero' required/>}
            />
          </Grid>
          <Grid item xs={4}>
          <Autocomplete
            id="age"
            options={edadesPermitidas}
            getOptionLabel={(option) => option.toString()}
            renderInput={(params) => <TextField {...params} label="Edad" required />}
            value={age}
            onChange={(event, newValue) => {
              setAge(newValue);
            }}
          />
          </Grid>
          <Grid item xs={6}>
          <Typography id="asistencia-slider" gutterBottom>
            Asistencia (%)
          </Typography>
          <Slider
            value={asistencia}
            aria-label="Asistencia"
            valueLabelDisplay="auto"
            min={10}
            max={100}
            step={1}
            onChange={(event, newValue) => {
              setAsistencia(newValue);
            }}
          />
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={2} maxWidth={1200} paddingTop={2}>
          <Grid item xs={6} container justifyContent="center">
              <Button 
                variant="outlined" 
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  setComuna(null);
                  setDependencia(null);
                  setGenero(null);
                  setEnseñanza(null);
                  setCurso(null);
                  setAge(null);
                  setAsistencia(50);
                  emojiReward();
                  setPrediction(0);
                }}
              >
                <span id="emojiReward" />
                Restaurar
              </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="center">
            <Button variant="contained" endIcon={<InputIcon />} onClick={handleSubmit}  disabled={!allFieldsFilled}>
              Predecir
            </Button>
          </Grid>
        </Grid>
        </Box>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        BackdropProps={{ 
          style: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } 
        }}
      >
        <DialogTitle>
          Prediccion de nota
        </DialogTitle>
        <DialogContent>
            <NotaVisual nota={prediction} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}
