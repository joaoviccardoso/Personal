import styled from "styled-components";
import Hero from "./componentes/Hero";
import Nav from "./componentes/Nav";

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
        </Container>
    </>
  )
      
  
}

export default App