import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciAdi, "abc");
  const errorMessage = screen.getByTestId("error");
  await waitFor(() => {
    expect(errorMessage).toBeInTheDocument();
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const submitButton = screen.getByText("Gönder");
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorMessages = screen.getAllByTestId("error");
    expect(errorMessages.length).toBe(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);

  const kullaniciAdi = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciAdi, "Yunus");

  const kullaniciSoyadi = screen.getByLabelText("Soyad*");
  userEvent.type(kullaniciSoyadi, "Akyüz");

  const submitButton = screen.getByText("Gönder");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessages = screen.getAllByTestId("error");
    expect(errorMessages.length).toBe(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);

  const emailInput = screen.getByLabelText("Email*");
  userEvent.type(emailInput, "gecersiz-email-adresi");

  const errorMessage = screen.getByTestId("error");
  expect(errorMessage).toHaveTextContent(
    "Hata: email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const adInput = screen.getByLabelText("Ad*");
  userEvent.type(adInput, "Zübeyde");
  const email = screen.getByLabelText(/Email*/i);
  userEvent.type(email, "ornek@gmail.com");
  const button = screen.getByRole("button", { name: /Gönder/i });
  userEvent.click(button);
  const errorMessage = await screen.findByTestId("error");
  expect(errorMessage).toHaveTextContent("Hata: soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);

  const kullaniciAdi = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciAdi, "Zeynep");

  const kullaniciSoyadi = screen.getByLabelText("Soyad*");
  userEvent.type(kullaniciSoyadi, "Kamadan");

  const kullaniciEmail = screen.getByLabelText("Email*");
  userEvent.type(kullaniciEmail, "octopusshead@gmail.com");

  const submitButton = screen.getByText("Gönder");
  userEvent.click(submitButton);

  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);

  const kullaniciAdi = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciAdi, "Zeynep");

  const kullaniciSoyadi = screen.getByLabelText("Soyad*");
  userEvent.type(kullaniciSoyadi, "Kamadan");

  const kullaniciEmail = screen.getByLabelText("Email*");
  userEvent.type(kullaniciEmail, "octopusshead@gmail.com");

  const kullaniciMesaj = screen.getByLabelText("Mesaj");
  userEvent.type(kullaniciMesaj, "Lorem Ipsum");

  const submitButton = screen.getByText("Gönder");
  userEvent.click(submitButton);

  expect(await screen.findByTestId("firstnameDisplay")).toHaveTextContent(
    "Zeynep"
  );
  expect(await screen.findByTestId("lastnameDisplay")).toHaveTextContent(
    "Kamadan"
  );
  expect(await screen.findByTestId("emailDisplay")).toHaveTextContent(
    "octopusshead@gmail.com"
  );
  expect(await screen.findByTestId("messageDisplay")).toHaveTextContent(
    "Lorem Ipsum"
  );
});
