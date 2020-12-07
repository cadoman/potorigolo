import React from 'react';
import styled from 'styled-components';
import LinkButton from './LinkButton';
import { ScrollableSteps, Step } from './ScrollableSteps';

interface Props {
  onSelectZip: () => void
}

const Container = styled.div`
  width: 70%;
  margin:  auto;
  img{
    max-width: 100%;
  }
  p:first-child{
    margin-top: 15vh;
  }
`;
const TutorialExtract: React.FC<Props> = (props: Props) => (
  <Container>
    <ScrollableSteps>
      <Step title="Aller sur Facebook">
        <p>
          Va sur
          {' '}
          <LinkButton to="https://www.facebook.com/dyi/?referrer=ayi">Facebook</LinkButton>
          {' '}
          pour télécharger tes données
        </p>
        <img src="images/dl_archive_landing_page.png" alt="Téléchargement des informations Facebook" />
      </Step>
      <Step title="Cocher Messages">
        <p>Coche uniquement la ligne &quot;Messages&quot;</p>
        <img src="images/download_archive_help_check_only_messages.png" alt="Coche uniquement message" />
      </Step>
      <Step title="Sélectionner JSON">
        <p>Sélectionne le format &quot;JSON&quot; et une qualité de photo Faible</p>
        <img src="images/download_archive_help_click_json.png" alt="Clic sur JSON" />
      </Step>
      <Step title="Créer le fichier">
        <p>Clique sur &quot;Créer un fichier&quot;</p>
        <img src="images/download_archive_help_check_click_create.png" alt="Clic Créer un fichier" />
      </Step>
      <Step title="Télécharger l'archive">
        <p>
          Tu vas recevoir un email (quelques minutes à une heure plus tard) pour
          <LinkButton to="https://www.facebook.com/dyi/?tab=all_archives&referrer=email">télécharger tes données</LinkButton>
        </p>
        <p>Télécharge le fichier .zip</p>
      </Step>
      <Step title="Importer l'archive">
        <p>Importe le fichier .zip</p>
        <button type="button" onClick={props.onSelectZip}>Importer le .zip</button>
      </Step>
    </ScrollableSteps>
  </Container>
);
export default TutorialExtract;
