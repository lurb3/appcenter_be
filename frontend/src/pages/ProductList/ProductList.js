import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Button, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import apiUtil from 'utils/api';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import ProductFormModal from './components/Modal';
import './productlist.scss';

const ProductList = () => {
  const [ loading, setLoading ] = useState(true);
  const [ lists, setLists ] = useState([]);
  const [ openFormModal, setOpenFormModal ] = useState(false);
  const [ openDialog, setOpenDialog ] = useState(false);
  const location = useLocation();
  const { shoppingListID } = useParams();

  const shoppingListName = location.state.name.charAt(0).toUpperCase() + location.state.name.slice(1);

  const setListsData = async () => {
    const lists = await apiUtil().get(`/product/${shoppingListID}`);
    setLists(lists.data || []);
    setLoading(false);
  };

  const handleDelete = async (e, item) => {
    e.preventDefault();
    setLoading(true);
    await apiUtil().delete(`/product/${item._id}`);
    setListsData();
  };

  const handleDeleteAll = async (req, res) => {
    setLoading(true);
    await apiUtil().delete(`/product/${shoppingListID}/all`);
    setLists([]);
    setLoading(false);
    setOpenDialog(false);
  };

  useEffect(() => {
    setListsData();
  }, []);

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
      height='100%'
      className='productListWrapper'
    >
      <ProductFormModal shoppingListID={shoppingListID} open={openFormModal} setOpen={setOpenFormModal} lists={lists} setLists={setLists} />
      <ConfirmDialog openDialog={openDialog} setOpenDialog={setOpenDialog} callback={handleDeleteAll} title ='Delete all products for this shopping list?' />
      <Grid item xs={8} textAlign='center'>
        <h1 className='colorWhite'>{shoppingListName} products</h1>
        <h4 className='colorWhite'>* Edit or remove a product</h4>
        <Paper style={{ padding: '10px' }}>
          { loading ? (
            <Grid container justifyContent='center' alignItems='center' direction='column'>
              <ClipLoader color="#36d7b7" />
              Loading products
            </Grid>
          ) : (
            <>
              <div className='wrapperHeader'>
                <Link to={`/shoppinglist`}>
                  <ArrowCircleLeftIcon color='primary' className='return' />
                </Link>
                <Grid>
                  <Button disabled={loading} className='deleteAll' variant='contained' color='error' onClick={() => setOpenDialog(true)}>
                    Delete all <DeleteIcon />
                  </Button>
                  <Button disabled={loading} variant='contained' color='primary' onClick={() => setOpenFormModal(!openFormModal)}>
                    Add new <AddCircleIcon />
                  </Button>
                </Grid>
              </div>
              <div>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell component="th">Name</TableCell>
                        <TableCell component="th">Product Link</TableCell>
                        <TableCell component="th">Quantity</TableCell>
                        <TableCell component="th">price</TableCell>
                        <TableCell component="th" align='right'></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lists.map((list) => (
                        <TableRow
                          key={list._id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {list.name.charAt(0).toUpperCase() + list.name.slice(1)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {
                              list.productLink && (
                                <a href={list.productLink} target='_blank' rel="noreferrer">{list.productLink.slice(0, 50)}{list.productLink.length > 50 && '...'}</a>
                              )
                            }
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {list?.quantity}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {list?.price}
                          </TableCell>
                          <TableCell component="th" scope="row" align='right'>
                            <Button disabled={loading} className='deleteButton' onClick={(e) => handleDelete(e, list)}><DeleteIcon /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProductList;
