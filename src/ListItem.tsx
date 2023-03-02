import { Button, ListGroup } from "react-bootstrap";

interface ListItemProps {
  item: string;
  onClick: (item: string) => void;
  onDelete: (item: string) => void;
}

export const ListItem = (props: ListItemProps) => {
  return (
    <ListGroup.Item onClick={() => props.onClick(props.item)}>
      {props.item}
      <Button variant="danger" onClick={() => props.onDelete(props.item)}>
        Ta bort
      </Button>
    </ListGroup.Item>
  );
};
