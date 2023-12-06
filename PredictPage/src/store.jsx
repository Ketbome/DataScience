import { create } from 'zustand'

const useStore = create((set) => ({
    comuna: null,
    dependencia: null,
    enseñanza: null,
    curso: null,
    genero: null,
    age: null,
    asistencia: 50,
    cursos: [],
    open: false,
    prediction: 0,
    setComuna: (comuna) => set({ comuna }),
    setDependencia: (dependencia) => set({ dependencia }),
    setEnseñanza: (enseñanza) => set({ enseñanza }),
    setCurso: (curso) => set({ curso }),
    setGenero: (genero) => set({ genero }),
    setAge: (age) => set({ age }),
    setAsistencia: (asistencia) => set({ asistencia }),
    setCursos: (cursos) => set({ cursos }),
    setOpen: (open) => set({ open }),
    setPrediction: (prediction) => set({ prediction }),
}));

export default useStore;