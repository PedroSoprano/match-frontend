/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, Box, Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [causes, setCauses] = useState([])
  const [dominios, setDominios] = useState([])
  const [classes, setClasses] = useState([])
  const [diagnosticos, setDiagnosticos] = useState([])

  const [formData, setFormData] = useState<any>({
    diagnostico: "",
    resultadosEsperados: "",
    codEnf: "",
    causas: [],
    dominio: "", 
    classe: "",
  });

  const isObjectEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj[key] === '' || (Array.isArray(obj[key]) && obj[key].length === 0)) {
        return true; 
      }
    }
    return false; 
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCausasChange = (event: any, values: any) => {
    setFormData({
      ...formData,
      causas: values.map((value: any) => ({ id: value.id })),
    });
  };

  const handleDiagnosticoChange = (event: any, value: any) => {
    setFormData({
      ...formData,
      diagnostico:  value.id,
      codEnf: value.codEnf
    });
    setIntervencoes(value.intervencao)
    console.log(value.intervencao)
  }

  // const handleIntervencoesChange = (event) => {
  //   const descricao = event.target.value;
  //   setFormData({
  //     ...formData,
  //     intervencoes: [{ descricao, opcional: false }],
  //   });
  // };

  const handleSave = () => {
    if(isObjectEmpty(formData)){
      toast.error("Todos os campos devem ser preenchidos")
    }else{
      api.post("/api/diagnostico", formData).then(() => {
        toast.success("Diagnóstico cadastrado com sucesso!")
        setFormData({
          diagnostico: "",
          resultadosEsperados: "",
          codEnf: "",
          causas: [],
          dominio: "", 
          classe: "",
          intervencoes: [],
        })
        setIntervencoes([])
        setTimeout(() => {
          window.location.reload()
        }, 5000)
      }).catch(() => {
        toast.error("Ocorreu um erro ao cadastrar o diagnóstico")
      })
    }
  };


  const api = axios.create({
    baseURL: import.meta.env.VITE_PORT_PROJECT_BACKEND,
  });

  const getCauses = () => {
    api.get("/api/cause").then((res) => {
      setCauses(res.data)
    })
  }

  const getDominios = () => {
    api.get("/api/dominios").then((res) => {
      setDominios(res.data)
    })
  }

  const getClasses = () => {
    api.get("/api/classes").then((res) => {
      setClasses(res.data)
    })
  }

  const getDiagnosticos = () => {
    api.get("/api/diagnostico").then((res) => {
      setDiagnosticos(res.data)
    })
  }

  useEffect(() => {
    getCauses()
    getDominios()
    getClasses()
    getDiagnosticos()
  }, [])

  const [intervencoes, setIntervencoes] = useState<any[]>([]);
  const [intervencaoAtual, setIntervencaoAtual] = useState({
    descricao: '',
    opcional: false,
  });


  const adicionarIntervencao = () => {
    setIntervencoes([...intervencoes, intervencaoAtual]);
    setFormData({
      ...formData,
      intervencoes: [...intervencoes, intervencaoAtual]
    })
    setIntervencaoAtual({
      descricao: '',
      opcional: false,
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#b4dadd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "500px",
          height: "500px",
          backgroundColor: "#ffffff",
          padding: 3,
          borderRadius: 4,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}
      >
        <Typography sx={{marginBottom: "20px", fontSize: "25px", color: "#01828e", fontWeight: 900}}>
          Cadastro de evidências clínicas e diagnósticos
        </Typography>


        <Autocomplete
          sx={{ marginBottom: 2 }}
          id="diagnostico"
          options={diagnosticos}
          onChange={handleDiagnosticoChange}

          getOptionLabel={(option: any) => option.nome}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diagnóstico"
              placeholder="Selecione"
            />
          )}
        />

        <TextField
          name="codEnf"
          label="Código enfermagem"
          disabled={true}
          value={formData.codEnf}
          placeholder={formData.codEnf ? "" : "Código enfermagem"}
          sx={{ marginBottom: 2 }}
          onChange={handleInputChange}
        />

        <Autocomplete
          multiple
          sx={{ marginBottom: 2 }}
          id="causas"
          options={causes}
          onChange={handleCausasChange}
          getOptionLabel={(option: any) => option.descricao}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Evidências clínicas"
              placeholder="Selecione"
            />
          )}
        />

        <Autocomplete
          id="dominio"
          options={dominios}
          sx={{ marginBottom: 2 }}
          getOptionLabel={(option: any) => option.nome}
          onChange={(event, value: any) => setFormData({ ...formData, dominio: (value.id) })}
          renderInput={(params) => <TextField {...params} label="Domínio" />}
        />

        <Autocomplete
          id="classe"
          options={classes}
          sx={{ marginBottom: 2 }}
          getOptionLabel={(option: any) => option.nome}
          onChange={(event, value: any) => setFormData({ ...formData, classe: (value.id) })}
          renderInput={(params) => <TextField {...params} label="Classe" />}
        />

          <Typography sx={{margin: "20px 0px", fontSize: "19px", color: "#01828e", fontWeight: 200}}>Intervenções</Typography>
          <Box sx={{backgroundColor: "#e7e7e7", borderRadius: 2, padding: "20px", minHeight: "150px",  marginBottom: "20px", overflowY: "auto"}}>
            <ul>
            {
            intervencoes.length > 0 ?
            intervencoes.map((item: any) => (
              <Typography sx={{fontSize: "14px"}}> ● {item.nome} {item.opcional ? "(Opcional)" : "(Obrigatório)"}</Typography>
            ))
            :
            <Box sx={{width: "100%", height: "150px", display: "flex", alignItems: "center", justifyContent: "center"}}>
              <Typography sx={{margin: "20px 0px", fontSize: "16px", fontWeight: 200}}>Nenhuma intervenção</Typography>
            </Box>
            }
            </ul>
          </Box>

          
        <TextField
          name="resultadosEsperados"
          label="Resultados esperados"
          placeholder="Resultados esperados"
          sx={{ marginBottom: 2 }}
          onChange={handleInputChange}

        />

        <Button variant="contained" sx={{backgroundColor: "#01828e"}} onClick={() => handleSave()}>
          Salvar
        </Button>
      </Box>
      <ToastContainer/>
    </Box>
  );
}

export default App;

