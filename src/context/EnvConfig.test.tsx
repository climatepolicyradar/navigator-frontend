import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import App from "@/pages/_app";

import { useEnvConfig, withEnvConfig } from "./EnvConfig";

const mockRouter = {} as any;
test("should not error when component does not use useEnvConfig nor uses withEnvConfig", async () => {
  const ComponentWithNoEnvConfig = () => <div>Hello testing library</div>;
  const WithNoUseEnvConfig = <App router={mockRouter} Component={ComponentWithNoEnvConfig} pageProps={{}} theme={""} adobeApiKey={""} />;

  const rendered = render(WithNoUseEnvConfig);
  expect(rendered.getByText("Hello testing library")).toBeInTheDocument();
});

test("should error when component uses useEnvConfig without using withEnvConfig", async () => {
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  const ComponentWithUseEnvConfig = () => {
    const envConfig = useEnvConfig();
    return <div>Hello testing library</div>;
  };

  const WithUseEnvConfig = <App router={mockRouter} Component={ComponentWithUseEnvConfig} pageProps={{}} theme={""} adobeApiKey={""} />;

  const rendered = render(WithUseEnvConfig);
  expect(rendered.getByText("Sorry, the app has encountered an error")).toBeInTheDocument();
  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test("should not error when component uses useEnvConfig with using withEnvConfig", async () => {
  const getServerSideProps = () => {
    return {
      props: {
        envConfig: withEnvConfig({ MY_VAR: "my_var" }),
      },
    };
  };
  const pageProps = getServerSideProps();

  const ComponentWithUseEnvConfig = (props: ReturnType<typeof getServerSideProps>["props"]) => {
    const envConfig = useEnvConfig();
    return <div>Hello testing library {props.envConfig.MY_VAR}</div>;
  };

  const WithNoNoEnvConfig = <App router={mockRouter} Component={ComponentWithUseEnvConfig} pageProps={pageProps.props} theme={""} adobeApiKey={""} />;

  const rendered = render(WithNoNoEnvConfig);
  expect(rendered.getByText("Hello testing library my_var")).toBeInTheDocument();
});
