package com.yicheng.protos;

import static io.grpc.stub.ClientCalls.asyncUnaryCall;
import static io.grpc.stub.ClientCalls.asyncServerStreamingCall;
import static io.grpc.stub.ClientCalls.asyncClientStreamingCall;
import static io.grpc.stub.ClientCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ClientCalls.blockingUnaryCall;
import static io.grpc.stub.ClientCalls.blockingServerStreamingCall;
import static io.grpc.stub.ClientCalls.futureUnaryCall;
import static io.grpc.MethodDescriptor.generateFullMethodName;
import static io.grpc.stub.ServerCalls.asyncUnaryCall;
import static io.grpc.stub.ServerCalls.asyncServerStreamingCall;
import static io.grpc.stub.ServerCalls.asyncClientStreamingCall;
import static io.grpc.stub.ServerCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedStreamingCall;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.6.1)",
    comments = "Source: JttProtocol.proto")
public final class JttRequestGrpc {

  private JttRequestGrpc() {}

  public static final String SERVICE_NAME = "com.yicheng.protos.JttRequest";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static final io.grpc.MethodDescriptor<com.yicheng.protos.JttProtocol.DeviceInfo,
      com.yicheng.protos.JttProtocol.Respone> METHOD_IMPORT_DEVICE_INFO =
      io.grpc.MethodDescriptor.<com.yicheng.protos.JttProtocol.DeviceInfo, com.yicheng.protos.JttProtocol.Respone>newBuilder()
          .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
          .setFullMethodName(generateFullMethodName(
              "com.yicheng.protos.JttRequest", "importDeviceInfo"))
          .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.DeviceInfo.getDefaultInstance()))
          .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.Respone.getDefaultInstance()))
          .build();
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static final io.grpc.MethodDescriptor<com.yicheng.protos.JttProtocol.BaseRequest,
      com.yicheng.protos.JttProtocol.Respone> METHOD_SUB_VEHICLE_LOCATION =
      io.grpc.MethodDescriptor.<com.yicheng.protos.JttProtocol.BaseRequest, com.yicheng.protos.JttProtocol.Respone>newBuilder()
          .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
          .setFullMethodName(generateFullMethodName(
              "com.yicheng.protos.JttRequest", "subVehicleLocation"))
          .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.BaseRequest.getDefaultInstance()))
          .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.Respone.getDefaultInstance()))
          .build();
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static final io.grpc.MethodDescriptor<com.yicheng.protos.JttProtocol.BaseRequest,
      com.yicheng.protos.JttProtocol.Respone> METHOD_UN_SUB_VEHICLE_LOCATION =
      io.grpc.MethodDescriptor.<com.yicheng.protos.JttProtocol.BaseRequest, com.yicheng.protos.JttProtocol.Respone>newBuilder()
          .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
          .setFullMethodName(generateFullMethodName(
              "com.yicheng.protos.JttRequest", "unSubVehicleLocation"))
          .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.BaseRequest.getDefaultInstance()))
          .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.Respone.getDefaultInstance()))
          .build();
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static final io.grpc.MethodDescriptor<com.yicheng.protos.JttProtocol.QueryVehicleTrack,
      com.yicheng.protos.JttProtocol.Respone> METHOD_QUERY_VEHICLE_TARK =
      io.grpc.MethodDescriptor.<com.yicheng.protos.JttProtocol.QueryVehicleTrack, com.yicheng.protos.JttProtocol.Respone>newBuilder()
          .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
          .setFullMethodName(generateFullMethodName(
              "com.yicheng.protos.JttRequest", "queryVehicleTark"))
          .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.QueryVehicleTrack.getDefaultInstance()))
          .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
              com.yicheng.protos.JttProtocol.Respone.getDefaultInstance()))
          .build();

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static JttRequestStub newStub(io.grpc.Channel channel) {
    return new JttRequestStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static JttRequestBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new JttRequestBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static JttRequestFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new JttRequestFutureStub(channel);
  }

  /**
   */
  public static abstract class JttRequestImplBase implements io.grpc.BindableService {

    /**
     */
    public void importDeviceInfo(com.yicheng.protos.JttProtocol.DeviceInfo request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnimplementedUnaryCall(METHOD_IMPORT_DEVICE_INFO, responseObserver);
    }

    /**
     */
    public void subVehicleLocation(com.yicheng.protos.JttProtocol.BaseRequest request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnimplementedUnaryCall(METHOD_SUB_VEHICLE_LOCATION, responseObserver);
    }

    /**
     */
    public void unSubVehicleLocation(com.yicheng.protos.JttProtocol.BaseRequest request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnimplementedUnaryCall(METHOD_UN_SUB_VEHICLE_LOCATION, responseObserver);
    }

    /**
     */
    public void queryVehicleTark(com.yicheng.protos.JttProtocol.QueryVehicleTrack request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnimplementedUnaryCall(METHOD_QUERY_VEHICLE_TARK, responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            METHOD_IMPORT_DEVICE_INFO,
            asyncUnaryCall(
              new MethodHandlers<
                com.yicheng.protos.JttProtocol.DeviceInfo,
                com.yicheng.protos.JttProtocol.Respone>(
                  this, METHODID_IMPORT_DEVICE_INFO)))
          .addMethod(
            METHOD_SUB_VEHICLE_LOCATION,
            asyncServerStreamingCall(
              new MethodHandlers<
                com.yicheng.protos.JttProtocol.BaseRequest,
                com.yicheng.protos.JttProtocol.Respone>(
                  this, METHODID_SUB_VEHICLE_LOCATION)))
          .addMethod(
            METHOD_UN_SUB_VEHICLE_LOCATION,
            asyncUnaryCall(
              new MethodHandlers<
                com.yicheng.protos.JttProtocol.BaseRequest,
                com.yicheng.protos.JttProtocol.Respone>(
                  this, METHODID_UN_SUB_VEHICLE_LOCATION)))
          .addMethod(
            METHOD_QUERY_VEHICLE_TARK,
            asyncServerStreamingCall(
              new MethodHandlers<
                com.yicheng.protos.JttProtocol.QueryVehicleTrack,
                com.yicheng.protos.JttProtocol.Respone>(
                  this, METHODID_QUERY_VEHICLE_TARK)))
          .build();
    }
  }

  /**
   */
  public static final class JttRequestStub extends io.grpc.stub.AbstractStub<JttRequestStub> {
    private JttRequestStub(io.grpc.Channel channel) {
      super(channel);
    }

    private JttRequestStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected JttRequestStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new JttRequestStub(channel, callOptions);
    }

    /**
     */
    public void importDeviceInfo(com.yicheng.protos.JttProtocol.DeviceInfo request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(METHOD_IMPORT_DEVICE_INFO, getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void subVehicleLocation(com.yicheng.protos.JttProtocol.BaseRequest request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncServerStreamingCall(
          getChannel().newCall(METHOD_SUB_VEHICLE_LOCATION, getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void unSubVehicleLocation(com.yicheng.protos.JttProtocol.BaseRequest request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(METHOD_UN_SUB_VEHICLE_LOCATION, getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void queryVehicleTark(com.yicheng.protos.JttProtocol.QueryVehicleTrack request,
        io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone> responseObserver) {
      asyncServerStreamingCall(
          getChannel().newCall(METHOD_QUERY_VEHICLE_TARK, getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class JttRequestBlockingStub extends io.grpc.stub.AbstractStub<JttRequestBlockingStub> {
    private JttRequestBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private JttRequestBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected JttRequestBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new JttRequestBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.yicheng.protos.JttProtocol.Respone importDeviceInfo(com.yicheng.protos.JttProtocol.DeviceInfo request) {
      return blockingUnaryCall(
          getChannel(), METHOD_IMPORT_DEVICE_INFO, getCallOptions(), request);
    }

    /**
     */
    public java.util.Iterator<com.yicheng.protos.JttProtocol.Respone> subVehicleLocation(
        com.yicheng.protos.JttProtocol.BaseRequest request) {
      return blockingServerStreamingCall(
          getChannel(), METHOD_SUB_VEHICLE_LOCATION, getCallOptions(), request);
    }

    /**
     */
    public com.yicheng.protos.JttProtocol.Respone unSubVehicleLocation(com.yicheng.protos.JttProtocol.BaseRequest request) {
      return blockingUnaryCall(
          getChannel(), METHOD_UN_SUB_VEHICLE_LOCATION, getCallOptions(), request);
    }

    /**
     */
    public java.util.Iterator<com.yicheng.protos.JttProtocol.Respone> queryVehicleTark(
        com.yicheng.protos.JttProtocol.QueryVehicleTrack request) {
      return blockingServerStreamingCall(
          getChannel(), METHOD_QUERY_VEHICLE_TARK, getCallOptions(), request);
    }
  }

  /**
   */
  public static final class JttRequestFutureStub extends io.grpc.stub.AbstractStub<JttRequestFutureStub> {
    private JttRequestFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private JttRequestFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected JttRequestFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new JttRequestFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.yicheng.protos.JttProtocol.Respone> importDeviceInfo(
        com.yicheng.protos.JttProtocol.DeviceInfo request) {
      return futureUnaryCall(
          getChannel().newCall(METHOD_IMPORT_DEVICE_INFO, getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.yicheng.protos.JttProtocol.Respone> unSubVehicleLocation(
        com.yicheng.protos.JttProtocol.BaseRequest request) {
      return futureUnaryCall(
          getChannel().newCall(METHOD_UN_SUB_VEHICLE_LOCATION, getCallOptions()), request);
    }
  }

  private static final int METHODID_IMPORT_DEVICE_INFO = 0;
  private static final int METHODID_SUB_VEHICLE_LOCATION = 1;
  private static final int METHODID_UN_SUB_VEHICLE_LOCATION = 2;
  private static final int METHODID_QUERY_VEHICLE_TARK = 3;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final JttRequestImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(JttRequestImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_IMPORT_DEVICE_INFO:
          serviceImpl.importDeviceInfo((com.yicheng.protos.JttProtocol.DeviceInfo) request,
              (io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone>) responseObserver);
          break;
        case METHODID_SUB_VEHICLE_LOCATION:
          serviceImpl.subVehicleLocation((com.yicheng.protos.JttProtocol.BaseRequest) request,
              (io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone>) responseObserver);
          break;
        case METHODID_UN_SUB_VEHICLE_LOCATION:
          serviceImpl.unSubVehicleLocation((com.yicheng.protos.JttProtocol.BaseRequest) request,
              (io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone>) responseObserver);
          break;
        case METHODID_QUERY_VEHICLE_TARK:
          serviceImpl.queryVehicleTark((com.yicheng.protos.JttProtocol.QueryVehicleTrack) request,
              (io.grpc.stub.StreamObserver<com.yicheng.protos.JttProtocol.Respone>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static final class JttRequestDescriptorSupplier implements io.grpc.protobuf.ProtoFileDescriptorSupplier {
    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.yicheng.protos.JttProtocol.getDescriptor();
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (JttRequestGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new JttRequestDescriptorSupplier())
              .addMethod(METHOD_IMPORT_DEVICE_INFO)
              .addMethod(METHOD_SUB_VEHICLE_LOCATION)
              .addMethod(METHOD_UN_SUB_VEHICLE_LOCATION)
              .addMethod(METHOD_QUERY_VEHICLE_TARK)
              .build();
        }
      }
    }
    return result;
  }
}
