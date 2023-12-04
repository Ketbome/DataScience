import { create } from 'zustand'

const useStore = create((set) => ({
    comuna: { id: null, name: '' },
    dependencia: { id: null, name: '' },
    enseñanza: { id: null, name: '' },
    curso: { id: null, name: '' },
    genero: { id: null, name: '' },
    age: 4,
    asistencia: 0,
    cursos: [],
    setComuna: (comuna) => set({ comuna }),
    setDependencia: (dependencia) => set({ dependencia }),
    setEnseñanza: (enseñanza) => set({ enseñanza }),
    setCurso: (curso) => set({ curso }),
    setGenero: (genero) => set({ genero }),
    setAge: (age) => set({ age }),
    setAsistencia: (asistencia) => set({ asistencia }),
    setCursos: (cursos) => set({ cursos }),
}));

export default useStore;