import * as React from 'react';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid'; // Grid version 1
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import data from './data.json';
import useStore from './store';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

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
    <div className='App'>
      <Container maxWidth='sm'>
        <Grid container spacing={2} columns={16} maxWidth={600} marginTop={25}>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id='comuna'
              options={data.comunas}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setComuna(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Comuna' />}
              required
            />
          </Grid>
          <Grid item xs={8}>
            <Autocomplete
              disablePortal
              id='dependencia'
              options={data.dependencia}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setDependencia(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Dependencia' />}
              required
            />
          </Grid>
          <Grid item xs={8}>
          <Autocomplete
            disablePortal
            id='enseñanza'
            options={data.enseñanza}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              setEnseñanza(newValue ? newValue : { id: null, name: '' });
              setCurso(null); // Resetea curso cuando enseñanza cambia
            }}
            renderInput={(params) => <TextField {...params} label='Enseñanza' />}
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
              renderInput={(params) => <TextField {...params} label='Curso' />}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              disablePortal
              id='genero'
              options={data.genero}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setGenero(newValue ? newValue : { id: null, name: '' })}
              renderInput={(params) => <TextField {...params} label='Genero' />}
              required
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={age}
                onChange={handleChange}
                required
              >
                {Array.from({ length: 15 }, (_, i) => i + 4).map((edad) => (
                  <MenuItem key={edad} value={edad}>
                    {edad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Asistencia (%)</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Asistencia (%)"
                value={asistencia}
                onChange={(event) => setAsistencia(event.target.value)}
                required
              >
                {Array.from({ length: 101 }, (_, i) => i).map((porcentaje) => (
                  <MenuItem key={porcentaje} value={porcentaje}>
                    {porcentaje}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2} columns={16} maxWidth={600} marginTop={25}>
        <Grid item xs={8}>
            <Button variant="outlined" startIcon={<DeleteIcon />}>
              Delete
            </Button>
          </Grid>
          <Grid item xs={8}>
          <Button variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
