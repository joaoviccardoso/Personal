import styled from "styled-components";
import Hero from "./componentes/Hero";
import Nav from "./componentes/Nav";
import OqueResolvemos from "./componentes/OqueResolvemos";

const Container = styled.section`
  background-color: #000;
  height: 100vh;
`

function App(){
  return(
    <>
        <Container>
            <Nav></Nav>
            <Hero></Hero>
            <OqueResolvemos></OqueResolvemos>
        </Container>
    </>
  )
      
  
}

export default App