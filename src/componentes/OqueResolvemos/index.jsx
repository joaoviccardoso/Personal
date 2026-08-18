import styled from "styled-components";

const Container = styled.section`
  background-color: #1a1a1a;
  height: 100vh;
  padding: 3rem 6rem;
`

const TituloComLinha = styled.h2`
    color: #fff;
    font-size: 48px;
`
const SpanVerde = styled.span`
    color: #00FF64;
    font-size: 48px;
`

const Linha = styled.div`
    margin-top: 2rem;
    border: #00FF64 2px solid;
    width: 120px;
`

function OqueResolvemos(){
  return(
    <>
        <Container>
            <TituloComLinha>O que <SpanVerde>Resolvemos</SpanVerde></TituloComLinha>
            <Linha/>
        </Container>
    </>
  )

}

export default OqueResolvemos