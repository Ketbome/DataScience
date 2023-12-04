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

export default function App() {
  const { comuna, dependencia, genero, curso, age, setComuna, asistencia, setDependencia, setGenero, setEnseñanza, setCursos, setCurso, setAge, setAsistencia } = useStore();
  const enseñanza = useStore(state => state.enseñanza);
  const cursos = useStore(state => state.cursos);

  const filtrarCursos = () => {
    if (enseñanza && enseñanza.id == 2) {
      setCursos(data.curso.filter((curso) => curso.id <= 8));
    } else if (enseñanza && (enseñanza.id == 5 || enseñanza.id == 7)) {
      setCursos(data.curso.filter((curso) => curso.id >= 9));
    } else {
      setCursos([]);
    }
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  
  useEffect(() => {
    filtrarCursos();
  }, [enseñanza]);

  return (
    <div className='App' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', height: '100vh', width: '100vw', marginTop: '' }}>
      <div style={{ paddingTop: '23vh' }}>
      <Container maxWidth='sm'>
        <Box sx={{ bgcolor: '#ffffff', boxShadow: 16, p: 2, borderRadius: 0, overflow: 'hidden'}}>
          <Grid container spacing={2} columns={16} maxWidth={600}>
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
              onChange={(event, newValue) => setCurso(newValue ? newValue : { id: null, name: '' })}
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
            options={Array.from({ length: 15 }, (_, i) => i + 4)}
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
        <Grid container spacing={2} columns={2} maxWidth={600} paddingTop={2}>
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
              }}
            >
              Restaurar
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="center">
          <Button variant="contained" endIcon={<InputIcon />}>
              Predecir
            </Button>
          </Grid>
        </Grid>
        </Box>
      </Container>
      </div>
    </div>
  );
}
