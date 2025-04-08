import styled from "styled-components";
import { API_KEY, API_URL } from "./Api/catApi";
import { useEffect, useState } from "react";

const SectionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
`;

const CatSetting = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 20px;
  background-color: gray;
  border-radius: 10px;
  width: 300px;
`;

const Itembox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledCheckbox = styled.input`
  accent-color: #6200ea;
`;

const Label = styled.label`
  color: white;
  margin-left: 8px;
`;

const CatButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ffffff;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #999999;
  }
  &:disabled {
    cursor: not-allowed;
    background-color: #e0e0e0;
    color: #b0b0b0;
  }
`;

const CatImage = styled.img`
  width: 15rem;
  height: 13rem;
  border-radius: 8px;
`;

const CatImageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 15rem;
  height: 15rem;
`;

const Loading = styled.strong`
  color: white;
  font-size: 1.2rem;
  width: 100%;
  height: 100%;
`;

function App() {
  const [catImg, setCatImg] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const isButtonDisabled = !enabled || autoRefresh;

  const fetchCat = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      const data = await res.json();
      setCatImg(data[0].url);
      console.log(catImg);
    } catch (error) {
      console.error("Error fetching cat image:", error);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchCat();
      if (autoRefresh) {
        const intervalId = setInterval(() => {
          fetchCat();
        }, 5000);
        return () => clearInterval(intervalId);
      }
    }
  }, [autoRefresh]);

  return (
    <SectionBox>
      <CatSetting>
        <Itembox>
          <StyledCheckbox
            type="checkbox"
            id="enabled"
            checked={enabled}
            onChange={() => {
              setEnabled((prev) => !prev);
              setAutoRefresh(false);
            }}
          />
          <Label htmlFor="enabled">Enabled</Label>
        </Itembox>
        <Itembox>
          <StyledCheckbox
            type="checkbox"
            id="auto"
            checked={autoRefresh && enabled}
            onChange={() => enabled && setAutoRefresh((prev) => !prev)}
          />
          <Label htmlFor="auto">Auto-refresh every 5 seconds</Label>
        </Itembox>
        <CatButton onClick={fetchCat} disabled={isButtonDisabled}>
          Get cat
        </CatButton>

        <CatImageBox>
          {catImg ? (
            <CatImage src={catImg} alt="Random Cat" />
          ) : (
            <Loading>Loading...</Loading>
          )}
        </CatImageBox>
      </CatSetting>
    </SectionBox>
  );
}

export default App;
