import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"; // Nếu bạn dùng Material-UI

export default function CustomerList() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Nhân viên phụ trách</TableCell>
            <TableCell align="right">Tên khách hàng</TableCell>
            <TableCell align="right">Số hồ cá của khách</TableCell>
            <TableCell align="right">Xem chi tiết</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell align="right">100,000 VND</TableCell>
            <TableCell align="right">Nguyen Van A</TableCell>
            <TableCell align="right">Đang chờ</TableCell>
            <TableCell align="right">
              <button>
                <a href="/staff/proposalDetails/1">View</a>
              </button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell align="right">200,000 VND</TableCell>
            <TableCell align="right">Tran Thi B</TableCell>
            <TableCell align="right">Hoàn thành</TableCell>
            <TableCell align="right">
              <button>
                <a href="/staff/proposalDetails/2">View</a>
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
