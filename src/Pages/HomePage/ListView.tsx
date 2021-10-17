import { List, ListItem } from 'react-onsenui';

const ListView = ({ title }: {title: string}) => {
  return (
    <List
      dataSource={['Row 1', 'Row 2']}
      renderRow={(row, idx) => (<ListItem key={idx} modifier='longdivider'>{row}</ListItem>)}
    />
  )
}

export default ListView;