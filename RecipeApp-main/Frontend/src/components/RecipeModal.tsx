import React from "react";
import { FoodRecipe } from "../types";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";

interface Props {
  recipe: FoodRecipe | null;
  onHide: VoidFunction;
  show: boolean;
}

const RecipeModal: React.FC<Props> = ({ recipe, onHide, show }) => {

  return (

    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
            <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                      {recipe?.Title}
                  </Modal.Title>
             </Modal.Header>
            <Modal.Body>
              {recipe?.Instructions}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
    </Modal>
  );

  
};

export default RecipeModal;